import { NodeHtmlMarkdown } from "node-html-markdown";

/**
 * HTML → Markdown conversion for the AI import pipeline.
 *
 * Converts cleaned HTML into Markdown so headings, lists, tables and links
 * survive for the model to parse, instead of flattening everything to a blob
 * of plain text.
 */

/** Elements that only add noise (images, embedded media) to keep the output compact. */
const IGNORED_ELEMENTS = [
  "img",
  "picture",
  "video",
  "audio",
  "source",
  "track",
  "svg",
];

export function htmlToMarkdown(html: string): string {
  const translator = new NodeHtmlMarkdown({
    ignore: IGNORED_ELEMENTS,
    keepDataImages: false,
    useInlineLinks: true,
    maxConsecutiveNewlines: 3,
  });
  return translator.translate(html);
}