export type JobImportPromptInput = {
  /** Page title extracted from the source website. */
  title: string;
  /** Original source URL. */
  url: string;
  /** Main readable content (Markdown or plain text) extracted from the page. */
  content: string;
};

/**
 * Build the prompt sent to the AI to turn a page into a structured job.
 *
 * The model is asked to return ONLY valid JSON matching `ImportedJob` and to
 * use `null` for every unknown field. The description must stay complete — all
 * sections (requirements, salary, education, ...) are kept, not summarized.
 */
export function buildJobImportPrompt(input: JobImportPromptInput): string {
  return `Extract the job posting below into structured JSON.

Return ONLY valid JSON. Do not add commentary, markdown or code fences.

Fields (use null when a value is unknown or does not exist):
- title: the job title
- company: the organization/company offering the position
- location: city and/or country
- category: field of activity (e.g. IT, Finance, Marketing, Engineering)
- employmentType: one of FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, TEMPORARY, COMPETITION
- description: the COMPLETE job description. Preserve ALL sections: missions/responsibilities, profile/requirements, required skills, experience level, education level, number of positions, salary/remuneration, benefits, work schedule and any other detail present. Do not summarize or truncate.
- deadline: the application deadline as yyyy-mm-dd when present
- applicationUrl: the URL where candidates apply, when present
- featured: true only when the posting is marked as featured/urgent
- sourceUrl: the URL of the page where the posting appears
- sourceName: the name of the website or organization that published the posting

Return null only if the information truly does not exist.

---
Page title:
${input.title}

Source URL:
${input.url}

Page content:
${input.content}
`;
}
