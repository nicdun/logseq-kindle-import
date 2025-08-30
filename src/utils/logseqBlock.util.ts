import type { BlockEntity } from "@logseq/libs/dist/LSPlugin";
import { KindleHighlight } from "../models/KindleHighlight";
import { settings } from "./settings.util";

export const createPagePropertiesBlock = async (
  block: BlockEntity,
  properties: Record<string, string | undefined>
): Promise<void> => {
  Object.entries(properties).forEach(async ([key, value]) => {
    if (value) {
      await logseq.Editor.upsertBlockProperty(block.uuid, key, value);
    }
  });
};

export const updateBlockState = async (block: BlockEntity): Promise<void> => {
  const properties = await logseq.Editor.getBlockProperties(block.uuid);
  const content = (await logseq.Editor.getBlock(block.uuid))!.content;

  await logseq.Editor.updateBlock(block.uuid, content, {
    properties: properties,
  });
};

export const createBlockOnCurrentPage = (
  uuid: string,
  highlight: KindleHighlight
): Promise<BlockEntity | null> => {
  return logseq.Editor.appendBlockInPage(uuid, `${highlight.text}`, {
    properties: {
      ...(highlight.page && { page: highlight.page }),
      ...(highlight.location && { location: highlight.location }),
      ...(highlight.note && settings.syncNotes() && { note: highlight.note }),
    },
  });
};

export const createChildHighlightBlock = (
  parentUuid: string,
  highlight: KindleHighlight
): Promise<BlockEntity | null> => {
  return logseq.Editor.insertBlock(parentUuid, `${highlight.text}`, {
    sibling: false,
    properties: {
      ...(highlight.page && { page: highlight.page }),
      ...(highlight.location && { location: highlight.location }),
      ...(highlight.note && settings.syncNotes() && { note: highlight.note }),
    },
  });
};

export const createHeadingBlockOnCurrentPage = (
  pageUuid: string,
  headingTitle: string
): Promise<BlockEntity | null> => {
  const content = headingTitle.startsWith("##")
    ? headingTitle
    : `## ${headingTitle}`;
  return logseq.Editor.appendBlockInPage(pageUuid, content);
};
