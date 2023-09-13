"use client";
// import fs from "fs";
import { join } from "path";
import CodeEditor from "@/components/CodeView/codeEditor";
import { useEffect, useState, useRef, MutableRefObject } from "react";

const basePath = join(process.cwd(), "src", "server", "openai", "code");
// const sourceCode = fs.readFileSync(join(basePath, "bs.py"), "utf-8");
export const CodeView = () => {
  const myRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  return (
    <div className="m-0.5 mt-0 flex flex-col bg-white p-1 pt-0 text-left">
      <div className="flex h-12 w-[28rem] select-none items-center p-1 pt-0 text-xl font-bold text-neutral-600">
        Code View
      </div>
      {/*<div className='font-mono p-2 px-4 whitespace-pre overflow-auto'>*/}
      {/*  {sourceCode}*/}
      {/*</div>*/}
      <div
        className="h-[28rem] overflow-auto bg-neutral-100 bg-opacity-100 shadow-md"
        id="code-editor"
        ref={myRef}
      >
        <CodeEditor />
      </div>
    </div>
  );
};

export default CodeView;
