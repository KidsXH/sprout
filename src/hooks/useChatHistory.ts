import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  addChat,
  selectMainChannelChats,
  selectNrOfChats,
  setChainNodes,
  updateMainChannelChats,
} from "@/store/chatSlice";
import { useEffect } from "react";
import {
  addNode,
  addRequests,
  ChatNodeWithID,
  RequestWithChannelID, selectNodePool,
  selectRequestPool,
  updateCodeRange,
} from "@/store/nodeSlice";
import { parseMessage, Planner } from "@/models/agents/planner";
import { selectSourceCode } from "@/store/modelSlice";
import { palatte } from "@/themes/palatte";
import { matchCode } from "@/utils/matchCode";

export const useChatHistory = () => {
  const dispatch = useAppDispatch();
  const requestPool = useAppSelector(selectRequestPool);
  const mainChatIDs = useAppSelector(selectMainChannelChats);
  const nrOfChats = useAppSelector(selectNrOfChats);
  const sourceCode = useAppSelector(selectSourceCode);
  const nodePool = useAppSelector(selectNodePool);

  useEffect(() => {
    if (requestPool.length > nrOfChats) {
      requestPool.forEach((request, idx) => {
        if (idx >= nrOfChats) {
          dispatch(addChat({ channel: request.channelID, messageID: idx }));
        }
      });
    }
  }, [requestPool, nrOfChats, dispatch]);

  useEffect(() => {
    dispatch(updateMainChannelChats());
  }, [dispatch, nrOfChats]);

  useEffect(() => {
    const chainNodes = chat2node(mainChatIDs, requestPool, sourceCode);
    dispatch(setChainNodes(chainNodes));
  }, [mainChatIDs, requestPool, sourceCode, dispatch]);

  useEffect(() => {
    dispatch(updateCodeRange(sourceCode));
  }, [sourceCode, nodePool, dispatch]);
};

export const saveRequestMessages = (
  planner: Planner,
  requestPool: RequestWithChannelID[],
  dispatch: any,
) => {
  console.log("Saving request messages");
  const chatMessages = planner.llm.chatMessages;
  const channelID = planner.channel;
  const chatChannel = requestPool.filter(
    (request) => request.channelID === channelID,
  );
  const newRequests = chatMessages.slice(chatChannel.length);

  const newContent = planner.writer.lastContent;
  newRequests.forEach((request, index) => {
    const msg = parseMessage(request);
    if (msg && request.role === "assistant") {
      const id = chatChannel.length + index;
      const node: ChatNodeWithID = {
        id,
        observation: msg.observation,
        thought: msg.thought,
        action: newContent,
      };
      dispatch(addNode(node));
    }
  });

  dispatch(addRequests([channelID, newRequests]));
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
  }[] = [];
  let index = 0;
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
      id: index,
      text: `${codeRange[0]}-${codeRange[1]}`,
      color: palatte[nodeList.length],
      range: codeRange,
      step: nodeList.length,
      summary: "$summary",
    };

    nodeList.push(node);

    index += 2;
  }

  return nodeList;
};
