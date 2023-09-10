"use client";
// import fs from "fs";
import { join } from "path";
import CodeEditor from "@/components/CodeView/codeEditor";
import { useEffect, useState, useRef, MutableRefObject } from "react";

const basePath = join(process.cwd(), "src", "server", "openai", "code");
// const sourceCode = fs.readFileSync(join(basePath, "bs.py"), "utf-8");
export const CodeView = () => {
  const myRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const [codeScrollTop, setCodeScrollTop] = useState<number>(0);

  useEffect(() => {
    const element = myRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [myRef]);

  const handleScroll = (event: any) => {
    const codeElement = document.getElementById("code-editor");

    setCodeScrollTop(codeElement?.scrollTop || 0);
    // console.log(codeElements[0]);
    console.log(codeElement?.scrollTop);
  };

  return (
    <div className="flex flex-col m-0.5 text-left bg-white p-1 mt-0 pt-0">
      <div className="flex w-[28rem] text-xl font-bold p-1 h-12 pt-0 text-neutral-600 items-center select-none">
        Code View
      </div>
      {/*<div className='font-mono p-2 px-4 whitespace-pre overflow-auto'>*/}
      {/*  {sourceCode}*/}
      {/*</div>*/}
      <div
        className="h-[28rem] bg-neutral-100 bg-opacity-100 shadow-md overflow-auto"
        id="code-editor"
        ref={myRef}
      >
        <CodeEditor />
      </div>
    </div>
  );
};

export default CodeView;
