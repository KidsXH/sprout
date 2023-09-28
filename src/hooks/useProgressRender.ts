import { useAppSelector } from "@/hooks/redux";
import { useEffect, useMemo, useState } from "react";
import { TutorialContent } from "@/models/agents/writer";
import { selectMainChannelID } from "@/store/chatSlice";
import { selectNodePool, selectRequestPool } from "@/store/nodeSlice";
import {selectClickNodeTrigger} from "@/store/selectionSlice";

export const useProgressRender = () => {
  const tutorialContent = useTutorialContent();
  const [renderedContent, setRenderedContent] = useState<TutorialContent[]>([]);
  const [renderedCount, setRenderedCount] = useState<number>(0);
  const [cachedContent, setCachedContent] = useState<TutorialContent[]>([]);
  const clickNodeTrigger = useAppSelector(selectClickNodeTrigger);

  const mainChannelID = useAppSelector(selectMainChannelID);

  useEffect(() => {
    console.log("useProgressRender: mainChannelID", mainChannelID, tutorialContent);
    setCachedContent(tutorialContent);
    setRenderedContent(tutorialContent);
    setRenderedCount(tutorialContent.length);
  }, [clickNodeTrigger]);

  useEffect(() => {
    if (
      cachedContent[cachedContent.length - 1]?.content !==
      renderedContent[renderedContent.length - 1]?.content
    ) {
      setRenderedContent([...cachedContent]);
    }
  }, [renderedContent]);

  useEffect(() => {
    const index = renderedCount;
    if (index === renderedContent.length) {
      if (index < tutorialContent.length) {
        renderedContent.push({ ...tutorialContent[index] });
        renderedContent[index].content = "";
        setRenderedContent([...renderedContent]);
      }
    } else if (
      index < renderedContent.length &&
      index < tutorialContent.length
    ) {
      const currentLength = renderedContent[index].content.length;
      const fullLength = tutorialContent[index].content.length;

      if (currentLength === fullLength) {
        setRenderedCount(index + 1);
      } else {
        renderedContent[index].content = tutorialContent[index].content.slice(
          0,
          currentLength + 1,
        );
        setCachedContent([...renderedContent]);
        setTimeout(() => {
          setRenderedContent([...renderedContent]);
        }, 10);
      }
    }
  }, [tutorialContent, renderedContent, renderedCount]);

  return renderedContent;
};

const useTutorialContent = () => {
  const mainChannelID = useAppSelector(selectMainChannelID);
  const requestPool = useAppSelector(selectRequestPool);
  const nodePool = useAppSelector(selectNodePool);

  return useMemo(
    () =>
      nodePool
        .filter((node) => requestPool[node.id].channelID === mainChannelID)
        .map((item) => item.action),
    [nodePool, requestPool, mainChannelID],
  );
};
