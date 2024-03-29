import React, { FC, useEffect, useState } from "react";
import { KindleBook } from "../models/KindleBook";
import { generateLogseqPage } from "../utils/logseqPage.util";
import { parseKindleData } from "../utils/parsing.util";
import { LoadingSpinner } from "./LoadingSpinner";
import { sendNotification } from "../utils/logseqNotification.util";

interface KindleDashboardProps {}

const KindleDashboard: FC<KindleDashboardProps> = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [feedbackIcon, setFeedbackIcon] = useState();

  const getHightlightsAndCreateLogseqPage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setShowSpinner(true);
    const file = event.target.files![0];

    if (!file) {
      sendErrorNotification(
        "No file selected - please select correct kindle highlights file!"
      );
      return;
    }

    if (!file.name.endsWith(".html")) {
      sendErrorNotification(
        "Wrong file type selected - you need to export your highlights in .html-format!"
      );
      return;
    }

    const text = await file.text();

    const book: KindleBook | null = parseKindleData(text);

    if (!book) {
      sendErrorNotification(
        "Kindle highlights cannot be found - please select correct kindle highlights file!"
      );
      return;
    }

    await generateLogseqPage(book!);
    setShowSpinner(false);
  };

  const sendErrorNotification = (message: string) => {
    sendNotification(message, "error");
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
