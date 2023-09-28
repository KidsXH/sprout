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
import { useEffect, useMemo } from "react";
import { usePlannerContext } from "@/providers/Planner";
import {
  selectNodePool,
  selectNumNodes,
  selectNumRequests,
  selectRequestPool,
} from "@/store/nodeSlice";
import { saveRequestMessages } from "@/hooks/useChatHistory";
import {
  activateChannel,
  ChannelStatus,
  clearActiveChannels,
  deactivateChannel,
  selectActiveChannels,
  selectFocusChatID,
  selectMainChannelChats,
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
  const focusChatID = useAppSelector(selectFocusChatID);
  const mainChannelChats = useAppSelector(selectMainChannelChats);

  const requestMemory = useMemo(() => {
    let requests = requestPool;
    if (focusChatID !== -1) {
      requests = requests.slice(0, focusChatID + 2);
    }
    return requests.filter((request) => request.channelID === mainChannelID);
  }, [focusChatID]);

  const tutorialMemory = useMemo(() => {
    let nodes = nodePool;
    if (focusChatID !== -1) {
      const maxNodeIndex = nodePool.findIndex(
        (node) => node.id === focusChatID,
      );
      nodes = nodes.slice(0, maxNodeIndex + 1);
    }
    return nodes.filter(
      (node) => requestPool[node.id].channelID === mainChannelID,
    );
  }, [focusChatID]);

  const [planners] = usePlannerContext();

  const continue2next = (numThoughts?: number) => {
    numThoughts = numThoughts || 3;
    dispatch(setNumRuns(numThoughts));
    dispatch(clearActiveChannels());
    const isLastChatNode =
      focusChatID === -1 ||
      focusChatID === mainChannelChats[mainChannelChats.length - 2];
    for (let i = 0; i < numThoughts; i++) {
      const planner = planners[i];
      let channel = numChannels + i - 1;

      if (i === 0) {
        // channel = mainChannelID;
        if (isLastChatNode) channel = mainChannelID;
        else channel = numChannels + numThoughts - 1;
      }

      planner.initialize(sourceCode, channel);
      planner.setMemory(
        requestMemory.map((request) => request.request),
        tutorialMemory.map((node) => node.action),
      );
      dispatch(
        activateChannel({
          channelID: channel,
          isActive: true,
          isDone: false,
          lastChatNodeID: -1,
        }),
      );
      planner
        .next()
        .then((res) => {
          const { hasNext, id } = res;
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
          dispatch(setCommand("pause"));
        });
    }
  };

  const nextWithCodeRange = (
    sourceCode: string,
    codeRange: [number, number],
    numThoughts?: number,
  ) => {
    numThoughts = numThoughts || 3;
    dispatch(setNumRuns(numThoughts));
    dispatch(clearActiveChannels());
    const isLastChatNode =
      focusChatID === -1 ||
      focusChatID === mainChannelChats[mainChannelChats.length - 2];
    for (let i = 0; i < numThoughts; i++) {
      const planner = planners[i];
      let channel = numChannels + i - 1;
      if (i === 0) {
        if (isLastChatNode) channel = mainChannelID;
        else channel = numChannels + numThoughts - 1;
      }

      planner.initialize(sourceCode, channel);
      planner.setMemory(
        requestMemory.map((request) => request.request),
        tutorialMemory.map((node) => node.action),
      );
      const planPrompt = planner.planPrompt4CodeExplain(sourceCode, codeRange);
      dispatch(
        activateChannel({
          channelID: channel,
          isActive: true,
          isDone: false,
          lastChatNodeID: -1,
        }),
      );
      planner
        .nextWithPlan(planPrompt)
        .then((res) => {
          const { hasNext, id } = res;
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
          dispatch(setCommand("pause"));
        });
    }
  };

  const vote = (channels: ChannelStatus[]) => {
    const voteMap: Map<string, number[]> = new Map();
    let maxVotes = 0;
    let bestGroup: number[] = [];

    channels
      .filter((channel) => channel.isActive)
      .forEach((channel) => {
        const { channelID, lastChatNodeID } = channel;
        const node = nodePool.find((node) => node.id === lastChatNodeID);
        if (node === undefined) return;
        const type = node.action.type;
        const codeRange = node.codeRange || [];
        const key = `${type}-${codeRange}`;

        if (!voteMap.has(key)) voteMap.set(key, []);
        const group = voteMap.get(key);
        if (group) {
          group.push(channelID);
          if (group.length > maxVotes) {
            maxVotes = group.length;
            bestGroup = group;
          }
        }
      });

    console.log("[Vote]", voteMap, "Best Group:", bestGroup);

    return bestGroup[0];
  };

  const allChannelsDone = activeChannels.every((channel) => channel.isDone);

  useEffect(() => {
    console.log("[ActiveChannels]", activeChannels);
  }, [activeChannels]);

  useEffect(() => {
    if (numRuns === 0 && runningState === "running" && allChannelsDone) {
      const bestResult = vote(
        activeChannels.filter((channel) => channel.isDone),
      );
      if (bestResult === undefined) {
        dispatch(setCommand("pause"));
      } else {
        dispatch(setMainChannelID(bestResult));
        dispatch(setRunningState("waited"));
        dispatch(setCommand("continue-next"));
      }
    }
  }, [dispatch, numRuns, runningState, activeChannels, allChannelsDone]);

  useEffect(() => {
    console.log("Command:", command, "RunningState:", runningState);
    if (command === "none") {
      return;
    }

    if (command === "pause" && numRuns === 0) {
      dispatch(setRunningState("paused"));
      dispatch(setCommand("none"));
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

    if (command === "next-plan") {
      if (runningState === "paused") {
        dispatch(setRunningState("running"));
        nextWithCodeRange(sourceCode, [0, sourceCode.length]);
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
  }, [dispatch, command, runningState, sourceCode, numRuns]);
};

export default usePlannerCommands;
