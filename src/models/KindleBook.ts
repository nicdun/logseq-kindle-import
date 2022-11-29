import { KindleHighlight } from "./KindleHighlight";

export interface KindleBook {
    highlights: KindleHighlight[];
    title?: string;
    authors?: string[];
}