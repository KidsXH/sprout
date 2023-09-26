import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  decreaseNumRuns,
  selectCommand,
  selectNumRuns,
  selectRunningState,
  selectSourceCode,
  setCommand,
  setNumRuns,
  setRunningState,
} from "@/store/modelSlice";
import { useEffect } from "react";
import { usePlannerContext } from "@/providers/Planner";
import { selectNodePool, selectRequestPool } from "@/store/nodeSlice";
import { saveRequestMessages } from "@/hooks/useChatHistory";
import {
  activateChannel,
  deactivateChannel,
  selectActiveChannels,
  selectMainChannelID,
  selectNumChannels,
  setMainChannelID,
} from "@/store/chatSlice";

const usePlannerCommands = () => {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector(selectSourceCode);
  const runningState = useAppSelector(selectRunningState);
  const command = useAppSelector(selectCommand);
  const numRuns = useAppSelector(selectNumRuns);
  const numChannels = useAppSelector(selectNumChannels);
  const mainChannelID = useAppSelector(selectMainChannelID);
  const requestPool = useAppSelector(selectRequestPool);
  const nodePool = useAppSelector(selectNodePool);
  const activeChannels = useAppSelector(selectActiveChannels);
  console.log('Request Pool:', requestPool)
  const requestMemory = requestPool.filter(
    (request) => request.channelID === mainChannelID,
  );

  const tutorialMemory = nodePool.filter(
    (node) => requestPool[node.id].channelID === mainChannelID,
  );

  const [planners] = usePlannerContext();

  const continue2next = (numThoughts?: number) => {
    numThoughts = numThoughts || 3;
    dispatch(setNumRuns(numThoughts));
    for (let i = 0; i < numThoughts; i++) {
      const planner = planners[i];
      const channel = i === 0 ? mainChannelID : numChannels + i - 1;
      planner.initialize(sourceCode, channel);
      planner.setMemory(
        requestMemory.map((request) => request.request),
        tutorialMemory.map((node) => node.action),
      );
      dispatch(activateChannel(planner.channel));
      planner
        .next()
        .then((res) => {
          const {hasNext, id} = res;
          if (hasNext) {
            saveRequestMessages(planners[id], requestPool, dispatch);
          } else {
            dispatch(deactivateChannel(planners[id].channel));
          }
          dispatch(decreaseNumRuns());
        })
        .catch((err) => {
          console.log("[Planner Error]", err);
          dispatch(decreaseNumRuns());
        });
    }
  };

  useEffect(() => {
    if (numRuns === 0 && runningState === "running") {
      if (activeChannels.length === 0) {
        dispatch(setRunningState("stopped"));
      } else {
        dispatch(setMainChannelID(activeChannels[0]));
        dispatch(setRunningState("waited"));
        dispatch(setCommand("continue-next"));
      }
    }
  }, [dispatch, numRuns, runningState, activeChannels]);

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
  }, [dispatch, command, runningState, sourceCode]);
};

export default usePlannerCommands;
