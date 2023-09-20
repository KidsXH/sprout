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

const usePlannerCommands = () => {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector(selectSourceCode);
  const runningState = useAppSelector(selectRunningState);
  const command = useAppSelector(selectCommand);

  const [planner] = usePlannerContext();

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
        planner.initialize(sourceCode);
        dispatch(setRunningState("running"));
        planner
          .next()
          .then((res) => {
            dispatch(setRunningState("waited"));
            if (res.hasNext) dispatch(setCommand("continue-next"));
          })
          .catch((err) => {
            console.log("[Error]", err);
            dispatch(setRunningState("stopped"));
          });
        dispatch(setCommand("none"));
      }
    }

    if (command === "continue") {
      if (runningState === "paused") {
        dispatch(setRunningState("running"));
        planner
          .next()
          .then((res) => {
            if (res.hasNext) {
              dispatch(setRunningState("waited"));
              dispatch(setCommand("continue-next"));
            } else {
              dispatch(setRunningState("stopped"));
            }
          })
          .catch((err) => {
            console.log("[Error]", err);
            dispatch(setRunningState("stopped"));
          });
        dispatch(setCommand("none"));
      }
    }

    if (command === "continue-next") {
      if (runningState === "waited") {
        dispatch(setRunningState("running"));
        planner
          .next()
          .then((res) => {
            if (res.hasNext) {
              dispatch(setRunningState("waited"));
              dispatch(setCommand("continue-next"));
            } else {
              dispatch(setRunningState("stopped"));
            }
          })
          .catch((err) => {
            console.log("[Error]", err);
            dispatch(setRunningState("stopped"));
          });
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
