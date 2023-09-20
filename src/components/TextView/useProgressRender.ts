import { useAppSelector } from "@/hooks/redux";
import { usePlannerContext } from "@/providers/Planner";
import { useEffect, useState } from "react";
import { TutorialContentType } from "@/models/agents/writer";

export const useProgressRender = () => {
  const runningState = useAppSelector((state) => state.model.runningState);

  const [planner] = usePlannerContext();
  const [tutorialContent, setTutorialContent] = useState<TutorialContentType[]>(
    [],
  );
  const [renderedContent, setRenderedContent] = useState<TutorialContentType[]>(
    [],
  );
  const [renderedCount, setRenderedCount] = useState<number>(0);

  useEffect(() => {
    const index = renderedCount;
    if (index === renderedContent.length) {
      if (index < tutorialContent.length) {
        renderedContent.push({ ...tutorialContent[index] });
        renderedContent[index].content = "";
        setRenderedContent([...renderedContent]);
      }
    } else {
      const currentLength = renderedContent[index].content.length;
      const fullLength = tutorialContent[index].content.length;

      if (currentLength === fullLength) {
        setRenderedCount(index + 1);
      } else {
        setTimeout(() => {
          renderedContent[index].content = tutorialContent[index].content.slice(
            0,
            currentLength + 1,
          );
          setRenderedContent([...renderedContent]);
        }, 10);
      }
    }
  }, [tutorialContent, renderedContent, renderedCount]);

  useEffect(() => {
    setTutorialContent([...planner.writer.tutorialContent]);
  }, [planner.writer.tutorialContent, runningState]);

  return renderedContent;
};
