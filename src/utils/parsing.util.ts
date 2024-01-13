import { KindleBook } from "../models/KindleBook";
import { KindleHighlight } from "../models/KindleHighlight";
import { HtmlHighlight } from "../models/htmlHightlight";

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
  const hightlightsSorted: HtmlHighlight[] = [];

  highlights.forEach((item, index) => {
    if (item.previousElementSibling?.innerHTML.includes("Highlight")) {
      hightlightsSorted[index] = {
        highlight: item,
        header: item.previousElementSibling,
      };
    }

    if (item.nextElementSibling?.innerHTML.includes("Note")) {
      hightlightsSorted[index] = {
        ...hightlightsSorted[index],
        note: item.nextElementSibling.nextElementSibling ?? undefined,
      };
    }
  });

  return hightlightsSorted
    .filter((item) => isHighlightValid(item.highlight))
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

const mapToKindleHighlight = (item: HtmlHighlight): KindleHighlight => {
  return {
    text: getHighlightText(item.highlight),
    color: getHighlightColor(item.header),
    page: getHighlightPage(item.header),
    location: getHightlightLocation(item.header),
    chapter: getHightlightChapter(item.header),
    note: getHightlightNote(item.note),
  };
};

const isHighlightValid = (item: HTMLElement): boolean => {
  const text = item.textContent?.trim();

  return !!text && text.length > 5;
};

const getHightlightNote = (item?: Element) => {
  return item?.textContent ?? undefined;
};

const getHighlightColor = (item: Element | null): string | undefined => {
  return item?.querySelector("span")?.innerHTML;
};

const getHighlightText = (item: HTMLElement): string => {
  return item.textContent!.trim();
};

const getHighlightPage = (item: Element | null): string | undefined => {
  const text = item?.textContent?.trim();

  if (!text || text.indexOf("Page") < 0) {
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
