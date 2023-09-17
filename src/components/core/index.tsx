"use client";
import { useEffect, memo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectCommand,
  selectRunningState,
  selectSourceCode,
  setCommand,
  setRunningState,
} from "@/store/modelSlice";
import LLMSettings from "@/components/core/llmSettings";
import { useLLM } from "@/components/core/useLLM";
import LLMController from "@/components/core/llmController";

const Core = () => {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector(selectSourceCode);
  const runningState = useAppSelector(selectRunningState);
  const command = useAppSelector(selectCommand);
  const llm = useLLM();

  const runLLM = useCallback(async () => {
    return llm?.solve(sourceCode);
  }, [llm, sourceCode]);

  useEffect(() => {
    console.log("Command:", command, "RunningState:", runningState);
    if (command === "none" || runningState === "running") {
      return;
    }
    if (command === "run") {
      dispatch(setRunningState("running"));
      runLLM().then((res) => {
        dispatch(setRunningState("stopped"));
      });
    }
    dispatch(setCommand("none"));
  }, [dispatch, command, runningState, runLLM]);

  return (
    <>
      <div className="flex select-none pr-10 font-mono">
        <LLMSettings />
      </div>
    </>
  );
};
export default memo(Core);
