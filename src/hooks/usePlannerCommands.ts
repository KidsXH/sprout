import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectCommand,
  selectRunningState,
  selectSourceCode,
  setCommand,
  setRunningState,
} from "@/store/modelSlice";
import { useEffect } from "react";
import { usePlannerContext } from "@/providers/Planner";
import { selectRequestPool } from "@/store/nodeSlice";
import { saveRequestMessages } from "@/hooks/useChatHistory";

const usePlannerCommands = () => {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector(selectSourceCode);
  const runningState = useAppSelector(selectRunningState);
  const command = useAppSelector(selectCommand);

  const requestPool = useAppSelector(selectRequestPool);

  const [planner] = usePlannerContext();

  const continue2next = () => {
    planner
      .next()
      .then((res) => {
        if (res.hasNext) {
          saveRequestMessages(planner, requestPool, dispatch);
          dispatch(setRunningState("waited"));
          dispatch(setCommand("continue-next"));
        } else {
          dispatch(setRunningState("stopped"));
        }
      })
      .catch((err) => {
        console.log("[Planner Error]", err);
        dispatch(setRunningState("stopped"));
      });
  };

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
        planner.initialize(sourceCode, 0);
        dispatch(setRunningState("running"));
        continue2next();
        dispatch(setCommand("none"));
      }
    }

    if (command === "continue") {
      if (runningState === "paused") {
        dispatch(setRunningState("running"));
        continue2next();
        dispatch(setCommand("none"));
      }
    }

    if (command === "continue-next") {
      if (runningState === "waited") {
        dispatch(setRunningState("running"));
        continue2next();
        dispatch(setCommand("none"));
      }
      if (runningState === "paused") {
        dispatch(setCommand("none"));
      }
    }

    if (command === "next") {
      dispatch(setRunningState("running"));
      planner
        .next()
        .then((res) => {
          dispatch(setRunningState("paused"));
        })
        .catch((err) => {
          console.log("[Error]", err);
          dispatch(setRunningState("stopped"));
        });
      dispatch(setCommand("none"));
    }
  }, [dispatch, command, runningState, planner, sourceCode]);
};

export default usePlannerCommands;
