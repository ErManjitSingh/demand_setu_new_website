import { cache } from "react";
import { buildApiUrl } from "@/lib/apiConfig";
import { inferLocationType } from "@/lib/logSearchSelection";

/** Build `/api/seo-listing/:category/:locationType/:stateOrCity` from listings search. */
export function buildSeoListingApiPath({ category, city = "", state = "", locationKind = null }) {
  const cat = String(category || "").trim();
  if (!cat || cat === "all") return null;

  const locationType = inferLocationType({ city, state, locationKind });
  if (locationType !== "state" && locationType !== "city") return null;

  const trimmedCity = String(city || "").trim();
  const trimmedState = String(state || "").trim();
  const location =
    locationType === "state"
      ? trimmedState || trimmedCity
      : trimmedCity || trimmedState;

  if (!location) return null;

  return `api/seo-listing/${encodeURIComponent(cat)}/${encodeURIComponent(locationType)}/${encodeURIComponent(location)}`;
}

export async function fetchSeoListingData(search) {
  const path = buildSeoListingApiPath(search);
  if (!path) return null;

  const response = await fetch(buildApiUrl(path), {
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error(`SEO listing fetch failed (${response.status})`);
  }

  return response.json();
}

/** Cached server fetch — returns `data[0]` when present. */
export const fetchSeoListingRecord = cache(async (category, city, state, locationKind) => {
  try {
    const payload = await fetchSeoListingData({
      category,
      city,
      state,
      locationKind,
    });
    if (!payload?.success || !Array.isArray(payload.data) || payload.data.length === 0) {
      return null;
    }
    return payload.data[0];
  } catch {
    return null;
  }
});

/** Decode entity-encoded CMS HTML and trim whitespace. */
export function normalizeSeoRichText(text) {
  let value = String(text || "").trim();
  if (!value) return "";

  if (/&lt;[a-z]/i.test(value) || /&amp;lt;/i.test(value)) {
    value = value
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/gi, "'");
  }

  return value;
}

export function isHtmlContent(text) {
  const value = normalizeSeoRichText(text);
  return /<\/?[a-z][^>]*>/i.test(value);
}

/** Clean Quill HTML and normalize list markup for display. */
export function prepareSeoHtml(html) {
  let value = normalizeSeoRichText(html);
  if (!value) return "";

  value = value.replace(/<span class="ql-ui"[^>]*>\s*<\/span>/gi, "");

  // Quill bullet lists use <ol><li data-list="bullet"> — render as a real unordered list.
  if (/<ol[^>]*>[\s\S]*<li[^>]*data-list="bullet"/i.test(value)) {
    value = value
      .replace(/<ol([^>]*)>/gi, "<ul$1>")
      .replace(/<\/ol>/gi, "</ul>")
      .replace(/\s*data-list="bullet"/gi, "");
  }

  return value;
}

export function seoTagsFromRecord(seo) {
  if (!seo || !Array.isArray(seo.tags)) return [];
  return seo.tags.map((tag) => String(tag || "").trim()).filter(Boolean);
}

export function seoMetadataFromRecord(seo) {
  if (!seo) return null;
  const tags = seoTagsFromRecord(seo);
  const keywords =
    seo.metaKeywords ||
    (tags.length > 0 ? tags.join(", ") : null);

  return {
    title: seo.metaTitle || seo.heading || null,
    description: seo.metaDescription || seo.subHeading || null,
    keywords,
    robots: seo.robotsMeta || null,
    alternates: seo.canonicalTag ? { canonical: seo.canonicalTag } : undefined,
  };
}

export function splitSeoParagraphs(text) {
  if (!text) return [];
  return String(text)
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
