import "@logseq/libs";
import type { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

const config: SettingSchemaDesc[] = [
  {
    default: "Book",
    description:
      "String used as a prefix for created pages due to kindle highlights. Creates a hierarchy in logseq if needed. Default is <empty>.",
    key: "pagePrefix",
    title: "Page Hierarchy Prefix",
    type: "string",
  },
  {
    default: "{text}",
    description:
      "Markdown formatting to use for highlights. Available variables: `{text}` (contents of the highlight), `{color}` (color of the highlight), ",
    key: "templateHighlight",
    title: "Highlight template",
    type: "string",
  }
];

/**
 * Settings object returns current settings.
 */
export const settings = {
  accessToken: (): string => logseq.settings!["accessToken"],
  highlight: (): string => logseq.settings!["templateHighlight"],
  pagePrefix: (): string => logseq.settings!["pagePrefix"],
  pageProperties: (): string => logseq.settings!["pageProperties"],
};

/**
 * Registers the settings.
 * Logseq creates plugin page.
 */
export const registerSettings = (): void => {
  logseq.useSettingsSchema(config);
};
