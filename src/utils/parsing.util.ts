import { KindleBook } from "../models/KindleBook";
import { KindleHighlight } from "../models/KindleHighlight";

export const parseKindleData = (content: string): KindleBook | null => {
  const dummyDom = document.createElement("html");
  dummyDom.innerHTML = content;

  const body = dummyDom.querySelector("body");
  const highlights: NodeListOf<HTMLElement> =
    body?.querySelectorAll(".noteText")!;

  const kindleBook: KindleBook = {
    highlights: getKindleHighlights(Array.from(highlights)),
    title: getBookTitle(body),
    authors: getBookAuthors(body),
  };

  if (kindleBook.highlights.length === 0 || !kindleBook.title) {
    return null;
  }

  return kindleBook;
};

const getKindleHighlights = (highlights: HTMLElement[]): KindleHighlight[] => {
  return highlights
    .filter((item) => isHighlightValid(item))
    .map((item) => mapToKindleHighlight(item));
};

const getBookTitle = (body: HTMLBodyElement | null): string | undefined => {
  // TODO ERROR Handling when body / Title undefined

  return body?.querySelector(".bookTitle")?.textContent?.trim();
};

const getBookAuthors = (body: HTMLBodyElement | null): string[] | undefined => {
  // TODO ERROR Handling when body / AUTHOR undefined
  return body?.querySelector(".authors")?.textContent?.split(";");
};

const mapToKindleHighlight = (item: HTMLElement): KindleHighlight => {
  return {
    text: getHighlightText(item),
    color: getHighlightColor(item),
    page: getHighlightPage(item),
    location: getHightlightLocation(item),
    chapter: getHightlightChapter(item),
  };
};

const isHighlightValid = (item: HTMLElement): boolean => {
  const text = item.textContent?.trim();

  return (
    text !== item.querySelector(".noteHeading")?.textContent?.trim() &&
    !!text &&
    text.length > 5
  );
};

const getHighlightColor = (item: Element): string | undefined => {
  const color: string | undefined = item
    .querySelector(".noteHeading")
    ?.querySelector("span")?.innerHTML;

  return color;
};

const getHighlightText = (item: HTMLElement): string => {
  const text = item.textContent!.trim();
  // TODO get only text content of element not of childs
  return text.substring(0, text.lastIndexOf("Highlight")).trim();
};

const getHighlightPage = (item: HTMLElement): string | undefined => {
  const text = item.querySelector(".noteHeading")?.textContent?.trim();
  return !!text
    ? text.substring(text.indexOf("Page") + 4, text.lastIndexOf("·")).trim()
    : undefined;
};

const getHightlightLocation = (item: HTMLElement): string | undefined => {
  const text = item.querySelector(".noteHeading")?.textContent?.trim();
  return !!text
    ? text.substring(text.indexOf("Location") + 8, text.length).trim()
    : undefined;
};

const getHightlightChapter = (item: HTMLElement): string | undefined => {
  const text = item.querySelector(".noteHeading")?.textContent?.trim();
  return !!text
    ? text.substring(text.indexOf("-") + 1, text.lastIndexOf(">")).trim()
    : undefined;
};
