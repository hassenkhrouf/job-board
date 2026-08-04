import { cache } from "react";
import {
  entitiesWithPublishedCount,
  type EntityWithCount,
} from "@/lib/jobs/get-entities-with-counts";
import { HUB_PAGE_LIMIT } from "@/lib/jobs/constants";

export const getLocationHub = cache(async (): Promise<EntityWithCount[]> => {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await entitiesWithPublishedCount("location", HUB_PAGE_LIMIT);
  } catch {
    return [];
  }
});
