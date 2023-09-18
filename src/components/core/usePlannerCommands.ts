import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectCommand,
  selectRunningState,
  selectSourceCode,
  setCommand,
  setRunningState,
} from "@/store/modelSlice";
import { useCallback, useEffect } from "react";
import { Planner } from "@/models/agents/planner";

const usePlannerCommands = (planner: Planner) => {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector(selectSourceCode);
  const runningState = useAppSelector(selectRunningState);
  const command = useAppSelector(selectCommand);

  const start = useCallback(() => {
    planner.setup(sourceCode);
  }, [planner, sourceCode]);

  const next = useCallback(async () => {
    return planner.next();
  }, [planner]);

  useEffect(() => {
    console.log("Command:", command, "RunningState:", runningState);
    if (command === "none") {
      return;
    }

    if (command === "pause") {
      dispatch(setRunningState("paused"));
    }

    if (command === "start") {
      if (runningState === "stopped") {
        start();
        dispatch(setRunningState("running"));
        next().then((res) => {
          setTimeout(() => {
            dispatch(setRunningState("waited"));
            if (res) dispatch(setCommand("continue-next"));
          }, 5000);
        });
        dispatch(setCommand("none"));
      }
    }

    if (command === "continue") {
      if (runningState === "paused") {
        dispatch(setRunningState("running"));
        next().then((res) => {
          setTimeout(() => {
            if (res) {
              dispatch(setRunningState("waited"));
              dispatch(setCommand("continue-next"));
            } else {
              dispatch(setRunningState("stopped"));
            }
          }, 5000);
        });
        dispatch(setCommand("none"));
      }
    }

    if (command === "continue-next") {
      if (runningState === "waited") {
        dispatch(setRunningState("running"));
        next().then((res) => {
          setTimeout(() => {
            if (res) {
              dispatch(setRunningState("waited"));
              dispatch(setCommand("continue-next"));
            } else {
              dispatch(setRunningState("stopped"));
            }
          }, 5000);
        });
        dispatch(setCommand("none"));
      }
      if (runningState === "paused") {
        dispatch(setCommand("none"));
      }
    }

    if (command === "next") {
      dispatch(setRunningState("running"));
      next().then((res) => {
        dispatch(setRunningState("paused"));
      });
      dispatch(setCommand("none"));
    }
  }, [dispatch, command, runningState, start, next]);
};

export default usePlannerCommands;
