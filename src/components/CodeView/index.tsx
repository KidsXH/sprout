"use client";
import CodeEditor from "@/components/CodeView/codeEditor";
import { useRef, MutableRefObject } from "react";

export const CodeView = () => {
  const myRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  return (
    <div className="m-0.5 mt-0 flex flex-col bg-white p-1 pt-0 text-left">
      <div className="flex h-12 w-[28rem] select-none items-center p-1 pt-0 text-xl font-bold text-green-900">
        Code
      </div>
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
