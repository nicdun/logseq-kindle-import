import "@logseq/libs";
import React from "react";
import "./index.css";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { registerSettings } from "./utils/settings.util";

function main() {
  const key = logseq.baseInfo.id;
  console.info(`${key}: MAIN`);

  registerSettings();

  const root = ReactDOM.createRoot(document.getElementById("app")!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  logseq.provideModel({
    openKindleHighlightsImport() {
      logseq.showMainUI();
    },
  });

  logseq.setMainUIInlineStyle({
    position: "fixed",
    zIndex: 11,
  });

  const toolbarButtonKey = "kindle-higlights-import";

  logseq.App.registerUIItem("toolbar", {
    key: toolbarButtonKey,
    template: `
    <a data-on-click="openKindleHighlightsImport" class="button ti ti-book" style="font-size: 22px; margin: 4px 4px;"></a>
  `,
  });
}

logseq.ready().then(main).catch(console.error);
