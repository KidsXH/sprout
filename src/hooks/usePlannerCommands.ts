import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  decreaseNumRuns,
  selectApiKey,
  selectCommand,
  selectModelName,
  selectNumRuns,
  selectRunningState,
  selectSourceCode,
  setCommand,
  setNumRuns,
  setRunningState,
} from "@/store/modelSlice";
import { useEffect, useMemo, useState } from "react";
import { usePlannerContext } from "@/providers/Planner";
import {
  selectNodePool,
  selectRequestPool,
  updateNode,
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
  setFocusChatID,
  setMainChannelID,
} from "@/store/chatSlice";
import {
  selectSelectedCodeRange,
  selectSelectedCodeRangeOnTree,
} from "@/store/selectionSlice";
import { VotingModel } from "@/models/api";

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
  const selectedCodeRange = useAppSelector(selectSelectedCodeRange);
  const selectedCodeRangeOnTree = useAppSelector(selectSelectedCodeRangeOnTree);
  const apiKey = useAppSelector(selectApiKey);
  const model = useAppSelector(selectModelName);
  const votingModel = new VotingModel(apiKey, model);
  const [bestChannelID, setBestChannelID] = useState<number>(-1);
  const [votingState, setVotingState] = useState<string>("none");

  const requestMemory = useMemo(() => {
    let requests = requestPool;
    if (focusChatID !== -1) {
      requests = requests.slice(0, focusChatID + 2);
    }
    return requests.filter((request) => request.channelID === mainChannelID);
  }, [focusChatID, mainChannelID, requestPool]);

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
  }, [focusChatID, mainChannelID, nodePool, requestPool]);

  const [planners] = usePlannerContext();

  const continue2next = (numThoughts?: number) => {
    console.log("[Memory]", requestMemory, tutorialMemory);
    numThoughts = numThoughts || 3;
    dispatch(setNumRuns(numThoughts));
    dispatch(clearActiveChannels());

    let newChannelID = numChannels;

    for (let i = 0; i < numThoughts; i++) {
      const planner = planners[i];
      let channel = mainChannelID;

      if (i > 0) {
        channel = newChannelID;
        newChannelID += 1;
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

  const nextSplit = () => {
    console.log("[Memory]", requestMemory, tutorialMemory);
    const numThoughts = 1;
    dispatch(setNumRuns(numThoughts));
    dispatch(clearActiveChannels());
    const planner = planners[0];
    const channel = numChannels;
    planner.initialize(sourceCode, channel);
    planner.setMemory(
      requestMemory.map((request) => request.request),
      tutorialMemory.map((node) => node.action),
    );
    const planPrompt = planner.planPrompt4Split(
      sourceCode,
      selectedCodeRangeOnTree,
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
  };

  const nextGroup = () => {
    const numThoughts = 1;
    dispatch(setNumRuns(numThoughts));
    dispatch(clearActiveChannels());
    const planner = planners[0];
    const channel = numChannels;
    planner.initialize(sourceCode, channel);
    planner.setMemory(
      requestMemory.map((request) => request.request),
      tutorialMemory.map((node) => node.action),
    );
    const planPrompt = planner.planPrompt4Group(
      sourceCode,
      selectedCodeRangeOnTree,
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
  };

  // const vote = (channels: ChannelStatus[]) => {
  //   const voteMap: Map<string, number[]> = new Map();
  //   let maxVotes = 0;
  //   let bestGroup: number[] = [];

  //   channels
  //     .filter((channel) => channel.isActive)
  //     .forEach((channel) => {
  //       const { channelID, lastChatNodeID } = channel;
  //       const node = nodePool.find((node) => node.id === lastChatNodeID);
  //       if (node === undefined) return;
  //       const type = node.action.type;
  //       const codeRange = node.codeRange || [];
  //       const key = `${type}-${codeRange}`;

  //       if (!voteMap.has(key)) voteMap.set(key, []);
  //       const group = voteMap.get(key);
  //       if (group) {
  //         group.push(channelID);
  //         if (group.length > maxVotes) {
  //           maxVotes = group.length;
  //           bestGroup = group;
  //         }
  //       }
  //     });

  //   console.log("[Vote]", voteMap, "Best Group:", bestGroup);

  //   return bestGroup[0];
  // };

  const vote = async (channels: ChannelStatus[]) => {
    const voteMap: Map<string, number[]> = new Map();
    let maxVotes = 0;
    let bestGroup: number[] = [];
    let choices: {
      id: number;
      key: string;
      type: string;
      content: string;
      lastNode: number;
    }[] = [];

    channels
      .filter((channel) => channel.isActive)
      .forEach((channel) => {
        const { channelID, lastChatNodeID } = channel;
        const node = nodePool.find((node) => node.id === lastChatNodeID);
        if (node === undefined) return;
        const type = node.action.type;
        const codeRange = node.codeRange || [];
        const key = `${type}-${codeRange}`;

        if (!voteMap.has(key)) {
          voteMap.set(key, []);
          choices.push({
            key: key,
            type: type,
            content: node.action.content,
            id: channelID,
            lastNode: lastChatNodeID,
          });
        }
        const group = voteMap.get(key);
        if (group) {
          group.push(channelID);
          if (group.length > maxVotes) {
            maxVotes = group.length;
            bestGroup = group;
          }
        }
      });
    if (choices.length === 0) return;

    const value = await votingModel.vote(choices);

    const { content } = value;
    if (content) {
      const parsed_content = JSON.parse(content);
      // console.log("[voting], parsed_content", parsed_content);
      // if (parsed_content.best) {
      let bestID = parsed_content.best == undefined ? 0 : parsed_content.best;

      // console.log("[voting complete] ", choices);
      // console.log("[voting complete] ", choices[bestID].id);

      if (parsed_content.justification !== undefined) {
        choices.forEach((element: any, index: number) => {
          const node = nodePool.find((node) => node.id === element.lastNode);
          // console.log("[voting justification] ", node, index);
          if (node) {
            dispatch(
              updateNode({
                id: element.lastNode,
                justification:
                  parsed_content.justification[index].justification,
              }),
            );
          }
        });
      }
      setBestChannelID(choices[bestID].id);
      setVotingState("voted");
      // console.log("[voting complete]", choices[parsed_content.best].id);
      // }
    } else {
      // console.log("[voting Error] no content");
    }

    // console.log("[Vote]", voteMap, "Best Group:", bestGroup);

    // return bestGroup[0];
  };

  const allChannelsDone = activeChannels.every((channel) => channel.isDone);

  useEffect(() => {
    console.log("[ActiveChannels]", activeChannels);
  }, [activeChannels]);

  useEffect(() => {
    if (numRuns === 0 && runningState === "running" && allChannelsDone) {
      setVotingState("voting");
      vote(activeChannels.filter((channel) => channel.isDone));
    }
  }, [dispatch, numRuns, runningState, activeChannels, allChannelsDone]);

  useEffect(() => {
    if (
      // numRuns === 0 &&
      // runningState === "running" &&
      // allChannelsDone &&
      votingState === "voted"
    ) {
      const bestIdx = activeChannels.findIndex(
        (channel) => channel.channelID === bestChannelID,
      );
      if (bestChannelID === undefined) {
        dispatch(setCommand("pause"));
      } else {
        const newChatNode = nodePool.find(
          (node) => node.id === activeChannels[bestIdx].lastChatNodeID,
        );
        dispatch(setMainChannelID(bestChannelID));
        dispatch(setFocusChatID(newChatNode?.id || -1));
        dispatch(setRunningState("waited"));
        dispatch(setCommand("continue-next"));
      }
    }
    setVotingState("none");
  }, [bestChannelID, votingState]);

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
        nextWithCodeRange(sourceCode, selectedCodeRange);
        dispatch(setCommand("none"));
      }
    }

    if (command === "next-split") {
      if (runningState === "paused") {
        dispatch(setRunningState("running"));
        nextSplit();
        dispatch(setCommand("none"));
      }
    }

    if (command === "next-group") {
      if (runningState === "paused") {
        dispatch(setRunningState("running"));
        nextGroup();
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
