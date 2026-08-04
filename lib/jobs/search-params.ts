export type RawSearchParams = Record<string, string | string[] | undefined>;

export type JobSearchParams = {
  q?: string;
  category?: string;
  location?: string;
  page: number;
};

function readParam(raw: RawSearchParams, key: string): string | undefined {
  const value = raw[key];
  const stringValue = Array.isArray(value) ? value[0] : value;

  if (stringValue == null) {
    return undefined;
  }

  const trimmed = stringValue.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseJobSearchParams(raw: RawSearchParams): JobSearchParams {
  const pageValue = readParam(raw, "page");
  const pageNumber = pageValue ? Number(pageValue) : 1;

  return {
    q: readParam(raw, "q"),
    category: readParam(raw, "category"),
    location: readParam(raw, "location"),
    page:
      Number.isFinite(pageNumber) && pageNumber > 0
        ? Math.floor(pageNumber)
        : 1,
  };
}

export function buildJobSearchPath(
  basePath: string,
  params: {
    q?: string;
    category?: string;
    location?: string;
    page?: number;
  },
): string {
  const search = new URLSearchParams();

  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.location) search.set("location", params.location);
  if (params.page && params.page > 1) {
    search.set("page", String(params.page));
  }

  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** True when the raw query should be redirected to a cleaned URL. */
export function jobSearchParamsAreDirty(raw: RawSearchParams): boolean {
  for (const key of ["q", "category", "location", "page"] as const) {
    const value = raw[key];
    const stringValue = Array.isArray(value) ? value[0] : value;

    if (stringValue == null) {
      continue;
    }

    if (stringValue === "" || stringValue.trim() !== stringValue) {
      return true;
    }

    if (key === "page") {
      const pageNumber = Number(stringValue);
      if (!Number.isFinite(pageNumber) || pageNumber <= 1) {
        return true;
      }
    }
  }

  return false;
}
