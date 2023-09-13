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
      <div className="flex w-[96rem] select-none items-center justify-end pr-10 font-mono">
        <div className="flex px-2">
          <LLMSettings />
        </div>

      </div>
    </>
  );
};

export default memo(Core);
