import { KindleBook } from "../models/KindleBook";
import { settings } from "./settings.util";

export const PROP_TITLE = "title";
export const PROP_AUTHOR = "author";
export const PROP_CREATED = "created";
export const PROP_TYPE = "type";

export const mapKindleDataToProperties = (
  item: KindleBook,
): Record<string, string | undefined> => {
  const defaultProperties = {
    [PROP_TITLE]: item.title,
    [PROP_CREATED]: new Date().toISOString(),
    [PROP_TYPE]: "[[Book]]",
    [PROP_AUTHOR]: item.authors?.map((item) => `[[${item.trim()}]]`).join(","),
  };

  //const pagePropertiesFromSettings: Record<string, string> | null =
  //loadCustomPagePropertiesFromSettings();

  //const customProperties: Record<string, string> | null =
  //  generateCustomProperties(item, pagePropertiesFromSettings);

  console.log(defaultProperties);

  return {
    ...defaultProperties,
  };
};

const loadCustomPagePropertiesFromSettings = (): Record<
  string,
  string
> | null => {
  try {
    return JSON.parse(settings.pageProperties());
  } catch (e) {
    logseq.UI.showMsg(
      "Parsing custom page properties failed. Please update your pageProperties settings and provide a valid JSON string.",
      "error",
    );
    return null;
  }
};
