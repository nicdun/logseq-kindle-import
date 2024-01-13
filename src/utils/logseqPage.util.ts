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

export const generateLogseqPage = async (item: KindleBook): Promise<void> => {
  const prefix = settings.pagePrefix();
  return createOrLoadLogseqPage(item, prefix);
};

const createOrLoadLogseqPage = async (
  item: KindleBook,
  prefix: string,
): Promise<void> => {
  const existingPage: LogseqPageEntity | null = await getPageByTitle(
    item.title!,
  );
  const pageProperties = mapKindleDataToProperties(item);

  const title = `${prefix ? prefix + "/" : ""}${item.title}`;

  if (existingPage) {
    logseq.UI.showMsg(
      "Page already imported - Please delete page and reimport highlights!",
      "error",
    );
    logseq.App.pushState("page", { name: title });
    return;
  } else {
    await logseq.Editor.createPage(title);
    logseq.App.pushState("page", { name: title });
  }

  const firstBlockOnPage: BlockEntity = (
    await logseq.Editor.getCurrentPageBlocksTree()
  )[0];

  createPagePropertiesBlock(firstBlockOnPage, pageProperties);
  updateBlockState(firstBlockOnPage);

  const currentPage = await logseq.Editor.getCurrentPage();

  for (const highlight of item.highlights) {
    await createBlockOnCurrentPage(currentPage!.uuid, highlight);
  }

  logseq.UI.showMsg("Import successfull!", "success");
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
