"use client";
import { memo } from "react";
import LLMSettings from "@/components/core/llmSettings";
import usePlannerCommands from "@/components/core/usePlannerCommands";

const Core = () => {
  usePlannerCommands();
  return (
    <>
      <div className="flex select-none pr-10 font-mono">
        <LLMSettings />
      </div>
    </>
  );
};
export default memo(Core);
