import type { EmploymentType } from "@prisma/client";
import { ImportError } from "@/lib/imports/types";

/** Strip HTML markup down to readable plain text (no third-party DOM needed). */
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Clamp a string to `max` characters, adding an ellipsis when truncated. */
export function clampText(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

/** True for http/https absolute URLs. */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const EMPLOYMENT_TYPE_ALIASES: Record<string, EmploymentType> = {
  full_time: "FULL_TIME",
  fulltime: "FULL_TIME",
  "full time": "FULL_TIME",
  "temps plein": "FULL_TIME",
  cdi: "FULL_TIME",
  cdd: "CONTRACT",
  contract: "CONTRACT",
  freelance: "CONTRACT",
  mission: "CONTRACT",
  part_time: "PART_TIME",
  parttime: "PART_TIME",
  "part time": "PART_TIME",
  "temps partiel": "PART_TIME",
  internship: "INTERNSHIP",
  stage: "INTERNSHIP",
  apprentissage: "INTERNSHIP",
  temporary: "TEMPORARY",
  interim: "TEMPORARY",
  "intérim": "TEMPORARY",
  competition: "COMPETITION",
  concours: "COMPETITION",
};

/**
 * Map a free-form employment type from the AI to one of our `EmploymentType`
 * enum values, or "" when it can't be mapped (the admin then picks one).
 */
export function normalizeEmploymentType(value: string | null): string {
  if (!value) {
    return "";
  }
  const raw = value.trim().toLowerCase();
  if ((Object.values(EMPLOYMENT_TYPE_ALIASES) as string[]).includes(raw)) {
    return raw;
  }
  const normalized = raw.replace(/[^a-zà-ÿ ]/g, " ").replace(/\s+/g, " ").trim();
  return EMPLOYMENT_TYPE_ALIASES[normalized] ?? "";
}

/**
 * Normalize a deadline from the AI (yyyy-mm-dd or any parseable date) into the
 * `yyyy-mm-dd` format expected by an `<input type="date">`, or "".
 */
export function deadlineToDateInput(value: string | null): string {
  if (!value) {
    return "";
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Map a thrown error (usually an {@link ImportError}) to a friendly message. */
export function importErrorMessage(error: unknown): string {
  if (error instanceof ImportError) {
    switch (error.code) {
      case "INVALID_URL":
        return "L'URL saisie n'est pas valide.";
      case "UNREACHABLE":
        return "Impossible de joindre le site. Vérifiez l'adresse et réessayez.";
      case "TIMEOUT":
        return "Le site a mis trop de temps à répondre. Réessayez dans un moment.";
      case "UNSUPPORTED":
        return "Le contenu de cette page n'est pas pris en charge.";
      case "EMPTY":
        return "Aucun contenu exploitable n'a été trouvé sur cette page.";
      case "AI_ERROR":
        return "Le traitement de l'annonce a échoué. Réessayez.";
    }
  }
  return "Une erreur inattendue est survenue.";
}