import React, { FC, useEffect, useState } from "react";
import { KindleBook } from "../models/KindleBook";
import { generateLogseqPage } from "../utils/logseqPage.util";
import { parseKindleData } from "../utils/parsing.util";
import { LoadingSpinner } from "./LoadingSpinner";

interface KindleDashboardProps {}

const KindleDashboard: FC<KindleDashboardProps> = () => {
  const [showSpinner, setShowSpinner] = useState(false);

  const getHightlightsAndCreateLogseqPage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setShowSpinner(true);

    const file = event.target.files![0];

    if (!file) {
      logseq.UI.showMsg(
        "No file selected - please select correct kindle highlights file!",
        "error"
      );
      setShowSpinner(false);
      return;
    }

    const text = await file.text();

    const book: KindleBook | null = parseKindleData(text);

    if (!book) {
      logseq.UI.showMsg(
        "Kindle highlights cannot be found - please select correct kindle highlights file!",
        "error"
      );
      setShowSpinner(false);
      return;
    }

    await generateLogseqPage(book!);
    setShowSpinner(false);
  };

  return (
    <div>
      <label
        htmlFor="default-input"
        className="block mb-2 text-xs font-bold text-gray-500"
      >
        Select the file you want to import kindle highlights from...
      </label>
      <div className="flex flex-row items-center">
        <input
          type="file"
          id="file-input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mr-2"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            getHightlightsAndCreateLogseqPage(event)
          }
        ></input>
        {showSpinner ? <LoadingSpinner /> : null}
      </div>
    </div>
  );
};
export default KindleDashboard;
