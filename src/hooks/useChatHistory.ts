import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  addChat,
  selectNrOfChats,
  updateMainChannelChats,
} from "@/store/chatSlice";
import { useEffect } from "react";
import {
  addRequests,
  RequestWithChannelID,
  selectRequestPool,
} from "@/store/nodeSlice";
import { Planner } from "@/models/agents/planner";

export const useChatHistory = () => {
  const dispatch = useAppDispatch();
  const requestPool = useAppSelector(selectRequestPool);
  const nrOfChats = useAppSelector(selectNrOfChats);

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
};

export const saveRequestMessages = (
  planner: Planner,
  requestPool: RequestWithChannelID[],
  dispatch: any,
) => {
  console.log("Saving request messages")
  const chatMessages = planner.llm.chatMessages;
  const channelID = planner.channel;
  const chatChannel = requestPool.filter(
    (request) => request.channelID === channelID,
  );
  const newRequests = chatMessages.slice(chatChannel.length);
  dispatch(addRequests([channelID, newRequests]));
};
