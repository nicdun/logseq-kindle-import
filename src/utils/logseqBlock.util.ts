import type { BlockEntity } from "@logseq/libs/dist/LSPlugin";
import { KindleHighlight } from "../models/KindleHighlight";

export const createPagePropertiesBlock = async (
  block: BlockEntity,
  properties: Record<string, string | undefined>
): Promise<void> => {
  Object.entries(properties).map(async ([key, value]) => {
    if(value) {
      await logseq.Editor.upsertBlockProperty(block.uuid, key, value);
    }
  });
};

export const updateBlockState = async (block: BlockEntity): Promise<void> => {
  const properties = await logseq.Editor.getBlockProperties(block.uuid);
  const content = (await logseq.Editor.getBlock(block.uuid))!.content;

  await logseq.Editor.updateBlock(block.uuid, "Updating props...", {
    properties: properties,
  });

  await logseq.Editor.updateBlock(block.uuid, content, {
    properties: properties,
  });
};

export const createBlockOnCurrentPage = (uuid: string, highlight: KindleHighlight): Promise<BlockEntity | null> => {
  return logseq.Editor.appendBlockInPage(
    uuid,
    `${highlight.text}`,
    { properties: { "page": highlight.page, "location": highlight.location } }
  );
}
