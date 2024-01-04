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
    .map((item) => mapToKindleHighlight(item, item.previousElementSibling));
};

const getBookTitle = (body: HTMLBodyElement | null): string | undefined => {
  // TODO ERROR Handling when body / Title undefined

  return body?.querySelector(".bookTitle")?.textContent?.trim();
};

const getBookAuthors = (body: HTMLBodyElement | null): string[] | undefined => {
  // TODO ERROR Handling when body / AUTHOR undefined
  return body?.querySelector(".authors")?.textContent?.split(";");
};

const mapToKindleHighlight = (item: HTMLElement, heading: Element | null): KindleHighlight => {
  return {
    text: getHighlightText(item),
    color: getHighlightColor(heading),
    page: getHighlightPage(heading),
    location: getHightlightLocation(heading),
    chapter: getHightlightChapter(heading),
  };
};

const isHighlightValid = (item: HTMLElement): boolean => {

  const text = item.textContent?.trim();

  return (
    !!text &&
    text.length > 5
  );
};

const getHighlightColor = (item: Element | null): string | undefined => {
  return item?.querySelector("span")?.innerHTML;
};


const getHighlightText = (item: HTMLElement): string => {
  return item.textContent!.trim();
};

const getHighlightPage = (item: Element | null): string | undefined => {
  const text = item?.textContent?.trim();

  if(!text || text.indexOf("Page") < 0) {
    return;
  }

  return text.substring(text.indexOf("Page") + 4, text.lastIndexOf("·")).trim();
};

const getHightlightLocation = (item: Element | null): string | undefined => {
  const text = item?.textContent?.trim();
  return !!text
    ? text.substring(text.indexOf("Location") + 8, text.length).trim()
    : undefined;
};


const getHightlightChapter = (item: Element | null): string | undefined => {
  const text = item?.textContent?.trim();
  return !!text
    ? text.substring(text.indexOf("-") + 1, text.lastIndexOf(">")).trim()
    : undefined;
};
