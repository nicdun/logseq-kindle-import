import { HighlightsColor } from "./enums";

export type KindleHighlight = {
  note?: string;
  color?: string;
  text: string;
  location?: string;
  page?: string;
  chapter?: string;
};
