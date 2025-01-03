import "@logseq/libs";
import { settings } from "./settings.util";
import {
  mapKindleDataToProperties,
  PROP_TITLE,
} from "./logseqPageProperties.util";
import {
  createBlockOnCurrentPage,
  createPagePropertiesBlock,
  updateBlockState,
} from "./logseqBlock.util";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import { LogseqPageEntity } from "../models/LogseqPageEntity";
import { KindleBook } from "../models/KindleBook";
import { sendNotification } from "./logseqNotification.util";

export const generateLogseqPage = async (item: KindleBook): Promise<void> => {
  const prefix = settings.pagePrefix();
  return createOrLoadLogseqPage(item, prefix);
};

const getHighlightFromBlock = (
  block: BlockEntity
): string => {
  const lines = block.content.split('\n').slice(0, -Object.entries(block.properties!).length);
  return lines.join('\n');
};

const createOrLoadLogseqPage = async (
  item: KindleBook,
  prefix: string,
): Promise<void> => {
  const pageProperties = mapKindleDataToProperties(item);

  const title = `${prefix ? prefix + "/" : ""}${item.title}`;

  await logseq.Editor.createPage(title);
  logseq.App.pushState("page", { name: title });

  const currentPage = await logseq.Editor.getCurrentPage();
  const blocksTree = await logseq.Editor.getPageBlocksTree(currentPage!.uuid);
  const firstBlockOnPage: BlockEntity = blocksTree[0];

  createPagePropertiesBlock(firstBlockOnPage, pageProperties);
  updateBlockState(firstBlockOnPage);

  // filter highlights to only new ones
  const existingContents = new Set(blocksTree.slice(1).map(getHighlightFromBlock));
  const newHighlights = item.highlights.filter(highlight => !existingContents.has(highlight.text));

  for (const highlight of newHighlights) {
    await createBlockOnCurrentPage(currentPage!.uuid, highlight);
  }

  sendNotification("Import successfull!", "success");
};

const getPageByTitle = async (
  title: string,
): Promise<LogseqPageEntity | null> => {
  const pages: LogseqPageEntity[] | null = await logseq.DB.q(
    `(page-property ${PROP_TITLE} "${title}")`,
  );

  if (!pages) {
    return null;
  }

  switch (pages.length) {
    case 0:
      return null;
    case 1:
      return pages[0];
    default:
      const sortedPagesByUpdatedAt: LogseqPageEntity[] = pages.sort(
        (a: LogseqPageEntity, b: LogseqPageEntity) => a.createdAt - b.createdAt,
      );

      return sortedPagesByUpdatedAt[0];
  }
};
