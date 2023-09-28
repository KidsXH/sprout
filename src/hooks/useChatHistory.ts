import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  addChat,
  changeChannelStatus,
  ChannelStatus,
  selectActiveChannels,
  selectMainChannelChats,
  selectMainChannelID,
  selectNumChats,
  setChainNodes,
  setFocusChatID,
  updateMainChannelChats,
} from "@/store/chatSlice";
import { useEffect } from "react";
import {
  addNode,
  addRequest,
  ChatNodeType,
  RequestWithChannelID,
  selectNodePool,
  selectNumHandledRequests,
  selectNumNodes,
  selectNumRequests,
  selectRequestPool,
  setNumHandledRequests,
  updateCodeRange,
} from "@/store/nodeSlice";
import { parseMessage, Planner } from "@/models/agents/planner";
import { selectSourceCode } from "@/store/modelSlice";
import { palatte } from "@/themes/palatte";
import { matchCode } from "@/utils/matchCode";
import { TutorialContentTypes } from "@/models/agents/writer";

export const useChatHistory = () => {
  const dispatch = useAppDispatch();
  const requestPool = useAppSelector(selectRequestPool);
  const numRequests = useAppSelector(selectNumRequests);
  const mainChatIDs = useAppSelector(selectMainChannelChats);
  const numChats = useAppSelector(selectNumChats);
  const sourceCode = useAppSelector(selectSourceCode);
  const nodePool = useAppSelector(selectNodePool);
  const numNodes = useAppSelector(selectNumNodes);
  const numHandledRequests = useAppSelector(selectNumHandledRequests);
  const mainChannelID = useAppSelector(selectMainChannelID);

  useEffect(() => {
    if (requestPool.length > numChats) {
      requestPool.forEach((request, idx) => {
        if (idx >= numChats) {
          dispatch(addChat({ channel: request.channelID, messageID: idx }));
        }
      });
    }
  }, [requestPool, numRequests, numChats, dispatch]);

  useEffect(() => {
    dispatch(updateMainChannelChats());
  }, [dispatch, numChats, mainChannelID]);

  useEffect(() => {
    const chainNodes = chat2node(mainChatIDs, requestPool, sourceCode);
    dispatch(setChainNodes(chainNodes));
  }, [mainChatIDs, requestPool, numRequests, sourceCode, dispatch]);

  useEffect(() => {
    // When the number of requests is changed, add new nodes to the node pool
    if (numHandledRequests === numRequests) return;
    let lastNodeID = -1;
    let channelID = -1;
    for (let i = numHandledRequests; i < numRequests; i++) {
      const chatNode = request2chatNode(requestPool[i]);
      if (chatNode) {
        lastNodeID = i;
        channelID = requestPool[i].channelID;
        dispatch(addNode({ id: i, ...chatNode }));
      }
    }
    if (lastNodeID !== -1) {
      const newChannelStatus: ChannelStatus = {
        channelID: channelID,
        isActive: true,
        isDone: true,
        lastChatNodeID: lastNodeID,
      };
      dispatch(changeChannelStatus(newChannelStatus));
    }
    dispatch(setNumHandledRequests(numRequests));
  }, [requestPool, numRequests, numHandledRequests, dispatch]);

  useEffect(() => {
    dispatch(updateCodeRange(sourceCode));
  }, [sourceCode, nodePool, numNodes, numRequests, dispatch]);

  // update the focus chat id when the number of chats is changed
  useEffect(() => {
    const latestNode = nodePool[nodePool.length - 1];
    if (latestNode) {
      const requestID = latestNode.id;
      if (mainChannelID === requestPool[requestID].channelID) {
        dispatch(setFocusChatID(latestNode.id));
      }
    }
  }, [numNodes, nodePool, dispatch]);
};

export const saveRequestMessages = (
  planner: Planner,
  requestPool: RequestWithChannelID[],
  dispatch: any,
) => {
  const chatMessages = planner.llm.chatMessages;
  const channelID = planner.channel;
  const chatChannel = requestPool.filter(
    (request) => request.channelID === channelID,
  );
  const newRequests = chatMessages.slice(chatChannel.length);
  newRequests.forEach((request) => {
    dispatch(addRequest([channelID, request]));
  });
};

const chat2node = (
  chats: number[],
  pool: RequestWithChannelID[],
  sourceCode: string,
) => {
  let nodeList: {
    id: number;
    text: string;
    color: string;
    range: number[];
    step: number;
    summary: string;
    requestID: number;
  }[] = [];
  let index = 0;
  let indexInChain = 0;
  while (index + 1 < chats.length) {
    const assistant = pool[chats[index]].request;
    const functionCall = pool[chats[index + 1]].request;

    if (assistant.role !== "assistant" || functionCall.role !== "function") {
      index++;
      continue;
    }

    const message = parseMessage(assistant);
    const functionName = assistant.function_call?.name || "";
    const functionArgs = JSON.parse(assistant.function_call?.arguments || "{}");

    const text =
      functionName === "writeExplanation"
        ? "code"
        : functionName.replace("write", "");

    const numLines = sourceCode.split("\n").length;
    let codeRange = [1, numLines];

    if (functionArgs.code !== undefined) {
      codeRange = matchCode(functionArgs.code, sourceCode);
    }

    const node = {
      id: indexInChain,

      text: `${codeRange[0]}-${codeRange[1]}`,
      color: palatte[nodeList.length],
      range: codeRange,
      step: nodeList.length,
      summary: "$summary",
      requestID: chats[index],
    };

    nodeList.push(node);
    indexInChain++;
    index += 2;
  }

  return nodeList;
};

const request2chatNode = (
  requestWithChannelID: RequestWithChannelID,
): ChatNodeType | undefined => {
  const { channelID, request } = requestWithChannelID;
  const msg = parseMessage(request);
  if (msg && request.role === "assistant") {
    const functionName = request.function_call?.name || "";
    const functionArgs = JSON.parse(request.function_call?.arguments || "{}");
    const type = functionName.replace("write", "").toLowerCase();
    const content = functionArgs[type];
    if (TutorialContentTypes.includes(type)) {
      return {
        observation: msg.observation,
        thought: msg.thought,
        action: {
          type: type,
          content: content,
          targetCode: functionArgs.code || "",
        },
      } as ChatNodeType;
    }
  }
};
