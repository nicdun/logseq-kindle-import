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
  },
  {
    default: "true",
    description:
      "Set to true if you would like to sync your individual notes per highlight",
    key: "syncNotes",
    title: "Sync notes",
    type: "boolean",
  }
];

/**
 * Settings object returns current settings.
 */
export const settings = {
  accessToken: (): string => logseq.settings!["accessToken"] as string,
  highlight: (): string => logseq.settings!["templateHighlight"]  as string,
  pagePrefix: (): string => logseq.settings!["pagePrefix"] as string,
  pageProperties: (): string => logseq.settings!["pageProperties"] as string,
  syncNotes: (): boolean => logseq.settings!["syncNotes"] as boolean
};

/**
 * Registers the settings.
 * Logseq creates plugin page.
 */
export const registerSettings = (): void => {
  logseq.useSettingsSchema(config);
};
