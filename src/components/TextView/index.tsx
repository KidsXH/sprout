"use client";
import TextBlock from "@/components/TextBlock";

import { useAppDispatch } from "@/hooks/redux";
import { useState, useEffect, useRef } from "react";
import { updateTextScrollTop } from "@/store/highlightSlice";
import { useProgressRender } from "@/hooks/useProgressRender";
import LLMController from "@/components/core/llmController";

export const TextView = () => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [textScrollTop, setTextScrollTop] = useState<number>(0);
  const dispatch = useAppDispatch();

  const renderedContent = useProgressRender();

  const handleWheelEvent = (event: any) => {
    const textElement = document.getElementById("text-editor");
    const scrollTop: number = textElement?.scrollTop || 0;
    setTextScrollTop(scrollTop);
  };

  const exportContent = () => {
    let content = "";
    renderedContent.forEach((item) => {
      content += item.content + "\n";
    });
    console.log(content);
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
        <div onClick={exportContent}>Document</div>
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
            <TextBlock
              index={index}
              key={index}
              role={item.type}
            >{`${item.content}`}</TextBlock>
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
