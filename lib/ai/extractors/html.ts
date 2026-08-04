import { parseHTML } from "linkedom";

/**
 * HTML cleaning for the AI import pipeline.
 *
 * Only removes obvious noise (script/style/svg/iframe/canvas/noscript,
 * cookie banners and ad containers). Everything else is kept so the LLM gets
 * the most complete content possible.
 */

/** Elements whose content is never useful in a job posting. */
const NOISE_TAGS = [
  "script",
  "style",
  "svg",
  "iframe",
  "canvas",
  "noscript",
  "template",
  "audio",
  "video",
  "object",
  "embed",
  "applet",
  "map",
  "param",
  "head",
  "nav",
  "footer",
];

/** Substrings found in the id/class of cookie banners and ad containers. */
const NOISE_HINTS = [
  "cookie",
  "consent",
  "gdpr",
  "advert",
  "adslot",
  "adsense",
  "ad-container",
  "ad-widget",
  "ad-box",
  "sponsored",
];

const AD_ATTRIBUTES = [
  "data-ad",
  "data-ad-client",
  "data-ad-slot",
  "data-ads",
  "data-google-query",
];

function hasNoiseHints(value: string): boolean {
  const lowered = value.toLowerCase();
  return NOISE_HINTS.some((hint) => lowered.includes(hint));
}

function isNoiseElement(element: Element): boolean {
  if (hasNoiseHints(element.getAttribute?.("id") ?? "")) {
    return true;
  }
  if (hasNoiseHints(element.getAttribute?.("class") ?? "")) {
    return true;
  }
  return AD_ATTRIBUTES.some((attr) => element.hasAttribute?.(attr));
}

/** Remove noise tags and cookie/ad containers. Returns cleaned body HTML. */
export function cleanHtml(html: string): string {
  const { document } = parseHTML(html);

  for (const tag of NOISE_TAGS) {
    for (const element of Array.from(document.querySelectorAll(tag))) {
      element.remove();
    }
  }

  for (const element of Array.from(document.body?.querySelectorAll("*") ?? [])) {
    if (isNoiseElement(element)) {
      element.remove();
    }
  }

  const root = document.body ?? document.documentElement;
  return root?.innerHTML ?? "";
}

/** Best-effort page title from the document or Open Graph metadata. */
export function pageTitle(html: string): string {
  const { document } = parseHTML(html);
  const ogTitle = document
    .querySelector("meta[property='og:title']")
    ?.getAttribute?.("content")
    ?.trim();
  return ogTitle || (document.title ?? "").trim();
}

/** Text of the first <h1> in the document, if any (the actual posting title). */
export function firstHeadingText(html: string): string {
  const { document } = parseHTML(html);
  const heading = document.querySelector("h1");
  const text = heading?.textContent?.replace(/\s+/g, " ").trim();
  return text ?? "";
}
