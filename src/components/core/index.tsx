"use client";
import { memo } from "react";
import LLMSettings from "@/components/core/llmSettings";
import usePlannerCommands from "@/hooks/usePlannerCommands";
import { useChatHistory } from "@/hooks/useChatHistory";

const Core = () => {
  usePlannerCommands();
  useChatHistory();
  return (
    <>
      <div className="flex select-none pr-10 font-mono text-sm">
        <LLMSettings />
      </div>
    </>
  );
};
export default memo(Core);
