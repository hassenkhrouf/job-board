import { extractFromHtml } from "@extractus/article-extractor";
import { ImportError } from "@/lib/imports/types";
import { clampText, htmlToText } from "@/lib/imports/shared";
import { cleanHtml, firstHeadingText, pageTitle } from "@/lib/ai/extractors/html";
import { htmlToMarkdown } from "@/lib/ai/extractors/markdown";
import { importDebugLog } from "@/lib/ai/debug";

/**
 * Multi-stage content extraction for a job page.
 *
 * Stage 1 – Download the full HTML ourselves so we always have it available.
 * Stage 2 – Try the Readability-style article extractor on that HTML.
 * Stage 3 – Evaluate the result: if the article is too short, drops headings,
 *           or is clearly incomplete, fall back to the full page converted to
 *           Markdown (script/style/svg/ads removed only).
 *
 * This keeps single-site scrapers unnecessary — the fallback captures the
 * sections (requirements, salary, education, etc.) that the article extractor
 * routinely loses on job boards and career pages.
 */

export const IMPORT_FETCH_TIMEOUT_MS = 15_000;
const IMPORT_MAX_CONTENT_LENGTH = 30_000;
const MIN_ARTICLE_LENGTH = 600;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 JobBoardBot/1.0 (+https://jobboard.local)";

export type ExtractedPage = {
  title: string;
  content: string;
  /** Which strategy produced the content: the article extractor or the HTML fallback. */
  format: "article" | "html";
};

/** Count HTML heading tags in a fragment of HTML. */
function countHeadings(html: string): number {
  return (html.match(/<h[1-6][\s>]/gi) ?? []).length;
}

export async function extractReadableContent(url: string): Promise<ExtractedPage> {
  const { html, finalUrl, htmlTitle } = await downloadHtml(url);

  const cleanedHtml = cleanHtml(html);
  const cleanedMarkdown = clampText(
    htmlToMarkdown(cleanedHtml),
    IMPORT_MAX_CONTENT_LENGTH,
  );

  // Stage 2: try the article extractor.
  let article: Awaited<ReturnType<typeof extractFromHtml>> = null;
  try {
    article = await extractFromHtml(html, finalUrl, {
      wordsPerMinute: 300,
      descriptionLengthThreshold: 60,
      contentLengthThreshold: 100,
    });
  } catch {
    article = null;
  }

  const articleHtml = article?.content ?? "";
  const articleTitle = (article?.title ?? "").trim();
  const articleText = clampText(
    htmlToText(articleHtml),
    IMPORT_MAX_CONTENT_LENGTH,
  );

  // Stage 3: pick the most complete variant.
  const articleLength = articleText.replace(/\s+/g, " ").trim().length;
  const fallbackLength = cleanedMarkdown.replace(/\s+/g, " ").trim().length;
  const articleTooShort = articleLength < MIN_ARTICLE_LENGTH;
  const articleHasHeadings = countHeadings(articleHtml) > 0;
  const fallbackHasHeadings = countHeadings(cleanedHtml) > 0;
  const fallbackRicher = fallbackLength >= articleLength * 1.5;

  const useFallback =
    !articleText ||
    articleTooShort ||
    (fallbackHasHeadings && !articleHasHeadings) ||
    fallbackRicher;

  const content = useFallback ? cleanedMarkdown : articleText;
  const title = useFallback
    ? firstHeadingText(cleanedHtml) || htmlTitle
    : articleTitle || htmlTitle;

  importDebugLog(
    "extract",
    [
      `url: ${url}`,
      `format: ${useFallback ? "html" : "article"}`,
      `articleLength: ${articleLength}`,
      `fallbackLength: ${fallbackLength}`,
      `content:\n${content}`,
    ].join("\n"),
  );

  if (!content) {
    throw new ImportError("EMPTY", "The page did not contain extractable text.");
  }
  if (!title) {
    throw new ImportError("EMPTY", "The page did not contain a title.");
  }

  return { title, content, format: useFallback ? "html" : "article" };
}

/** Stage 1: download the full page HTML. */
async function downloadHtml(url: string): Promise<{
  html: string;
  finalUrl: string;
  htmlTitle: string;
}> {
  let response: Response;
  try {
    response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "accept-language": "en,fr;q=0.8",
      },
      signal: AbortSignal.timeout(IMPORT_FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      throw new ImportError("TIMEOUT", "Page fetch timed out.", { cause: error });
    }
    throw new ImportError("UNREACHABLE", "Could not fetch page.", { cause: error });
  }

  if (!response.ok) {
    throw new ImportError(
      "UNREACHABLE",
      `Page returned HTTP ${response.status}.`,
    );
  }

  const html = await response.text();
  if (!html.trim()) {
    throw new ImportError("EMPTY", "The page was empty.");
  }

  return { html, finalUrl: response.url || url, htmlTitle: pageTitle(html) };
}