import React, { useRef } from "react";
import logo from "./assets/AmazonKindleLogo.png";
import { useAppVisible } from "./hooks/useAppVisible";
import KindleDashboard from "./components/KindleDashboard";

export function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const isVisible = useAppVisible();

  if (isVisible) {
    return (
      <main
        className="relative h-full"
        onClick={(e) => {
          if (!innerRef.current?.contains(e.target as any)) {
            window.logseq.hideMainUI();
          }
        }}
      >
        <div
          ref={innerRef}
          className="absolute flex flex-col items-stretch top-12 right-4 p-2 w-full max-w-[420px] bg-white rounded-lg border shadow-md sm:p-4"
        >
          <div>
            <div className="flex flex-row justify-start items-center pb-4">
              <img className="w-[40px] pr-2" src={logo} alt="Kindle logo" />
              <h3 className="font-bold">Kindle Highlights Import</h3>
            </div>
            <KindleDashboard />
          </div>
        </div>
      </main>
    );
  }

  return null;
}

export default App;
