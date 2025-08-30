import { KindleBook } from "../models/KindleBook";
import { KindleHighlight } from "../models/KindleHighlight";

export const parseKindleData = (content: string): KindleBook | null => {
  const dummyDom = document.createElement("html");
  dummyDom.innerHTML = content;

  const body = dummyDom.querySelector("body");
  const kindleBook: KindleBook = {
    highlights: getKindleHighlights(body),
    title: getBookTitle(body),
    authors: getBookAuthors(body),
  };

  if (kindleBook.highlights.length === 0 || !kindleBook.title) {
    return null;
  }

  return kindleBook;
};

const getKindleHighlights = (
  body: HTMLBodyElement | null
): KindleHighlight[] => {
  if (!body) return [];

  const results: KindleHighlight[] = [];
  const headings = Array.from(body.querySelectorAll(".noteHeading"));

  headings.forEach((heading) => {
    if (!isHighlightHeading(heading)) return;

    const textElement = heading.nextElementSibling;
    if (!textElement?.classList.contains("noteText")) return;
    if (!isHighlightValid(textElement as HTMLElement)) return;

    const headingText = heading.textContent ?? "";
    const highlight: KindleHighlight = {
      text: getHighlightText(textElement),
      color: getHighlightColor(heading),
      page: getHighlightPage(headingText),
      location: getHightlightLocation(headingText),
      chapter: getHightlightChapterFromHeading(heading),
      note: undefined,
    };

    const maybeNoteHeading = textElement.nextElementSibling;
    if (
      maybeNoteHeading &&
      maybeNoteHeading.classList.contains("noteHeading") &&
      !isHighlightHeading(maybeNoteHeading)
    ) {
      const noteTextElement = maybeNoteHeading.nextElementSibling;
      if (noteTextElement?.classList.contains("noteText")) {
        highlight.note = getHightlightNote(noteTextElement);
      }
    }

    results.push(highlight);
  });

  return results;
};

const getBookTitle = (body: HTMLBodyElement | null): string | undefined => {
  // TODO ERROR Handling when body / Title undefined
  return body?.querySelector(".bookTitle")?.textContent?.trim();
};

const getBookAuthors = (body: HTMLBodyElement | null): string[] | undefined => {
  const raw = body?.querySelector(".authors")?.textContent;
  if (!raw) return undefined;
  return raw
    .split(";")
    .map((a) => a.trim())
    .filter((a) => a.length > 0);
};

const isHighlightValid = (item?: HTMLElement | null): boolean => {
  const text = item?.textContent?.trim();
  return !!text && text.length > 0;
};

const getHightlightNote = (item?: Element) => {
  return item?.textContent ?? undefined;
};

const normalizeText = (text: string): string => {
  return text
    .replace(/\u00A0/g, " ") // Replace non-breaking spaces with regular spaces
    .replace(/\u2019/g, "'") // Replace curly single quotes with straight quotes
    .replace(/\u2018/g, "'") // Replace curly single quotes with straight quotes
    .replace(/\u201D/g, '"') // Replace curly double quotes with straight quotes
    .replace(/\u201C/g, '"') // Replace curly double quotes with straight quotes
    .replace(/\u2013/g, "-") // Replace en dashes with hyphens
    .replace(/\u2014/g, "-") // Replace em dashes with hyphens
    .trim();
};

const getHighlightColor = (item: Element | null): string | undefined => {
  const span = item?.querySelector("span");
  if (!span) return undefined;
  const cls = (span as HTMLElement).className || "";
  const match = /highlight_([a-z]+)/i.exec(cls);
  if (match) return match[1].toLowerCase();
  return span.textContent?.trim() || undefined;
};

const getHighlightText = (item: Element): string => {
  return normalizeText(item.textContent ?? "");
};

const PAGE_LABELS = [
  "Page",
  "Seite",
  "Página",
  "Pagina",
  "Pge", // placeholder for potential variants
];

const LOCATION_LABELS = [
  "Location",
  "Emplacement",
  "Posición",
  "Position",
  "Posizione",
  "Locatie",
  "Localização",
  "Ubicazione",
];

const extractLabelNumber = (
  text: string,
  labels: string[]
): string | undefined => {
  for (const label of labels) {
    const idx = text.toLowerCase().indexOf(label.toLowerCase());
    if (idx >= 0) {
      const sub = text.slice(idx + label.length);
      const match = /(\d+(\s*-\s*\d+)?)/.exec(sub);
      if (match) return match[1].replace(/\s/g, "");
    }
  }
  return undefined;
};

const getHighlightPage = (
  text: string | Element | null
): string | undefined => {
  const t = typeof text === "string" ? text : text?.textContent ?? "";
  if (!t) return undefined;
  const byLabel = extractLabelNumber(t, PAGE_LABELS);
  if (byLabel) return byLabel;
  const match = /(\d+(\s*-\s*\d+)?)/.exec(t);
  return match ? match[1].replace(/\s/g, "") : undefined;
};

const getHightlightLocation = (
  text: string | Element | null
): string | undefined => {
  const t = typeof text === "string" ? text : text?.textContent ?? "";
  if (!t) return undefined;
  const byLabel = extractLabelNumber(t, LOCATION_LABELS);
  if (byLabel) return byLabel;
  const matches = Array.from(t.matchAll(/(\d+(\s*-\s*\d+)?)/g));
  if (matches.length > 0)
    return matches[matches.length - 1][1].replace(/\s/g, "");
  return undefined;
};

const getHightlightChapterFromHeading = (
  heading: Element | null
): string | undefined => {
  let cursor = heading?.previousElementSibling;
  while (cursor) {
    if (cursor.classList.contains("sectionHeading")) {
      return normalizeText(cursor.textContent ?? "");
    }
    cursor = cursor.previousElementSibling;
  }
  return undefined;
};

const isHighlightHeading = (el: Element | null): boolean => {
  if (!el) return false;
  return !!el.querySelector('span[class^="highlight_"]');
};
