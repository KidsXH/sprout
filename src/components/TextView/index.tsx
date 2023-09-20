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
import LLMController from "@/components/core/llmController";
import { usePlannerContext } from "@/providers/Planner";
import { TutorialContentType } from "@/models/agents/writer";
import {useProgressRender} from "@/components/TextView/useProgressRender";

// const getResults = async () => await runLLM();

export const TextView = () => {
  // const result = await planner.solve("", true);
  // const argsString = result?.data.choices[0].message?.function_call?.arguments;
  const textRef = useRef<HTMLDivElement | null>(null);
  const argsString = undefined;
  const args = argsString ? JSON.parse(argsString) : undefined;
  const [textScrollTop, setTextScrollTop] = useState<number>(0);
  const dispatch = useAppDispatch();

  const renderedContent = useProgressRender();

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
      <div className="flex h-12 select-none items-center p-1 pt-0 text-xl font-bold text-green-900">
        <div>Document</div>
        <div className="ml-auto mr-4">
          <LLMController />
        </div>
      </div>
      <div
        className="h-[28rem] overflow-auto pr-2"
        onWheel={handleWheelEvent}
        id="text-editor"
        ref={textRef}
      >
        {renderedContent.length > 0 ? (
          renderedContent.map((item, index) => (
            <TextBlock index={index} key={index}>{`${item.content}`}</TextBlock>
          ))
        ) : (
          <TextBlock index={0} role="placeholder">
            Click `Generate` to start.
          </TextBlock>
        )}
      </div>
    </div>
  );
};

export default TextView;
