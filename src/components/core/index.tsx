"use client";
import { memo } from "react";
import LLMSettings from "@/components/core/llmSettings";
import { usePlanner } from "@/components/core/usePlanner";
import usePlannerCommands from "@/components/core/usePlannerCommands";
import { useAppSelector } from "@/hooks/redux";
import { selectApiKey, selectModelName } from "@/store/modelSlice";

const Core = () => {
  const apiKey = useAppSelector(selectApiKey);
  const modelName = useAppSelector(selectModelName);
  const planner = usePlanner(apiKey, modelName);
  usePlannerCommands(planner);
  return (
    <>
      <div className="flex select-none pr-10 font-mono">
        <LLMSettings />
      </div>
    </>
  );
};
export default memo(Core);
