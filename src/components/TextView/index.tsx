"use client";
import TextBlock from "@/components/TextBlock";

// import runLLM from '@/server/openai/chain';
import ClientLog from "../ModelViewer/log";

// import { planner } from "@/server/openai/agents/planner";
import chain from "@/mocks/chain";
import { node } from "@/mocks/nodes";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useState, useEffect, useRef, use } from "react";
import { updateTextScrollTop } from "@/store/highlightSlice";

// const getResults = async () => await runLLM();

export const TextView = () => {
  // const result = await planner.solve("", true);
  // const argsString = result?.data.choices[0].message?.function_call?.arguments;
  const textRef = useRef<HTMLDivElement | null>(null);
  const argsString = undefined;
  const args = argsString ? JSON.parse(argsString) : undefined;
  const [textScrollTop, setTextScrollTop] = useState<number>(0);
  const dispatch = useAppDispatch();
  const handleWheelEvent = (event: any) => {
    // const codeEditor = CodeRef.current?.editor;
    const textElement = document.getElementById("text-editor");
    const scrollTop: number = textElement?.scrollTop || 0;
    setTextScrollTop(scrollTop);
  };

  useEffect(() => {
    const textElement = textRef.current;

    if (textElement) {
      textElement.addEventListener("scrollend", handleWheelEvent);
    }
    return () => {
      if (textElement) {
        textElement.removeEventListener("scrollend", handleWheelEvent);
      }
    };
  }, []);

  useEffect(() => {
    dispatch(updateTextScrollTop(textScrollTop));
  }, [textScrollTop]);

  return (
    <div className="m-0.5 ml-0 mt-0 flex  w-3/5 flex-col bg-white p-1 pt-0">
      <div className="flex h-12 select-none items-center p-1 pt-0 text-xl font-bold text-neutral-600">
        Document
      </div>
      <div
        className="h-[28rem] overflow-auto pr-2"
        onWheel={handleWheelEvent}
        id="text-editor"
        ref={textRef}
      >
        {chain.map((item: node, id: number) => (
          // <TextBlock key={id}>{`${item.content[item.contentID]}`}</TextBlock>
          <TextBlock key={id}>{`${
            item.content[item.contentID].content
          }`}</TextBlock>
        ))}
      </div>
      {/* <ClientLog content={result} /> */}
      {/* <TextEditor /> */}
    </div>
  );
};

export default TextView;
