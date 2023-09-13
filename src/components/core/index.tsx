"use client";
import { useEffect, memo } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectCommand,
  selectRunningState,
  selectSourceCode,
  setCommand,
} from "@/store/modelSlice";
import LLMSettings from "@/components/core/llmSettings";

const Core = () => {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector(selectSourceCode);
  const runningState = useAppSelector(selectRunningState);
  const command = useAppSelector(selectCommand);

  useEffect(() => {
    if (command === "continue") {
    }
    dispatch(setCommand("none"));
  }, [dispatch, command]);

  return (
    <>
      <div className="flex select-none pr-10 font-mono">
        <LLMSettings />
      </div>
    </>
  );
};

export default memo(Core);
