"use client";
import React, { useCallback } from "react";
import * as d3 from "d3";
import Button from "@mui/material-next/Button";
import InputBase from "@mui/material/InputBase";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel, {
  formControlLabelClasses,
} from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { createStyles, makeStyles, styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectApiKey, selectModelName, setCommand } from "@/store/modelSlice";
import { selectFocusChatID } from "@/store/chatSlice";
import { TreeNode, useTreeNodes } from "../VisView/outline";

import // ChatCompletionFunctions,
// ChatCompletionRequestMessage,
// Configuration,
// OpenAIApi,
"openai";
import { BaseModel, RefineModel } from "@/models/api";
import { updateRequestContent } from "@/store/nodeSlice";

export const ConfigPanel = (props: { content: string; type: string }) => {
  const [promptRefinementString, setPromptRefinementString] = useState("");

  const writingStyles = [
    "(default)",
    "academic",
    "humorous",
    "eloquent",
    "engaging",
    "passionate",
  ];
  const [writingStyle, setWritingStyle] = useState(writingStyles[0]);
  const [writingStyleIndex, setWritingStyleIndex] = useState(0);

  const levelsOfDetail = ["concise", "(default)", "detailed"];
  const [levelOfDetail, setLevelOfDetail] = useState(levelsOfDetail[1]);
  const handleLevelOfDetailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLevelOfDetail((event.target as HTMLInputElement).value);
  };

  const focusChatID = useAppSelector(selectFocusChatID);
  const treeNodes = useTreeNodes();

  const bigRectWidth = 260;
  const bigRectHeight = 72;
  const textOffsetY = (bigRectHeight / 4) * 3;
  const codeRangeOffsetX = 15;
  const codeRangeOffsetY = 25;
  const nodeRectData: { color: string; range: number[]; text: string } = {
    color: "#C6EBD4",
    range: [0, 0],
    text: "node",
  };
  const [blockContent, setBlockContent] = useState(props.content);

  useEffect(() => {
    const currentTreeNode = treeNodes.find((node) =>
      node.requestID.includes(focusChatID),
    );
    // TODO: populate node data;
  }, [focusChatID, treeNodes]);

  useEffect(() => {
    setBlockContent(props.content);
  }, [props.content]);

  const dispatch = useAppDispatch();
  const apiKey = useAppSelector(selectApiKey);
  const model = useAppSelector(selectModelName);
  const refineModel = new RefineModel(apiKey, model);

  const getRefinedMsg = async (
    prompt: string,
    content: string,
    type: string,
  ) => {
    const message = await refineModel.retriveRefinedContent(
      prompt,
      content,
      type,
    );
    return message;
  };

  const handleConfirm = useCallback(async () => {
    setBlockContent("");
    console.log("[config]", promptRefinementString, props.content, props.type);
    const refinedMsg = await getRefinedMsg(
      promptRefinementString,
      props.content,
      props.type,
    );

    for await (const chunk of refinedMsg) {
      const msg = chunk.choices[0]?.delta?.content;
      console.log("[config] msg", msg);
      if (msg !== undefined && msg !== null) {
        // const content = JSON.parse(msg);
        // console.log("[config] parsed", content);
        setBlockContent((blockContent) => blockContent.concat(msg));
      }
    }
  }, [promptRefinementString, props.content]);

  const handleReset = () => {
    setWritingStyle(writingStyles[0]);
    setWritingStyleIndex(0);
    setLevelOfDetail(levelsOfDetail[1]);
  };

  const handleApply = useCallback(() => {
    dispatch(updateRequestContent({ id: focusChatID, content: blockContent }));
  }, [blockContent, focusChatID]);

  useEffect(() => {
    const buttons = document.getElementsByClassName("style-button");
    if (buttons.length === 0) return;
    buttons[writingStyleIndex].classList.add("selectedStyleButtonStyle");

    return () => {
      if (buttons.length === 0) return;
      buttons[writingStyleIndex].classList.remove("selectedStyleButtonStyle");
    };
  }, [writingStyleIndex]);

  useEffect(() => {
    let prompt = "";

    // both not default
    if (
      writingStyle != writingStyles[0] &&
      levelOfDetail != levelsOfDetail[1]
    ) {
      prompt = `Please make this paragraph more ${writingStyle} and ${levelOfDetail}`;
      setPromptRefinementString(prompt);
      return;
    }

    // style not default
    if (writingStyle != writingStyles[0]) {
      prompt = `Please make this paragraph more ${writingStyle}`;
    }

    // LOD not default
    if (levelOfDetail != levelsOfDetail[1]) {
      prompt = `Please make this paragraph more ${levelOfDetail}`;
    }

    setPromptRefinementString(prompt);
  }, [writingStyle, levelOfDetail]);

  return (
    <div className="configPanel ml-3 mt-0 flex w-full flex-col">
      <div className="text-space mb-4 flex h-[6rem] w-full overflow-scroll rounded border-2 border-white bg-neutral-100 bg-opacity-100 p-3  pt-2 text-xs leading-5 hover:border-neutral-200 hover:shadow">
        {blockContent || props.content}
      </div>
      <div className="relative mb-4">
        <div className="grid grid-cols-3 gap-1 rounded-md border-2 border-gray-200 pb-1 pt-2">
          {writingStyles.map((v, i) => (
            <div
              className="style-button flex h-5 w-full items-center justify-center text-xs text-slate-500 underline decoration-gray-200 decoration-solid decoration-4 underline-offset-1"
              key={i}
              onClick={() => {
                setWritingStyleIndex(i);
                setWritingStyle(v);
              }}
            >
              {v}
            </div>
          ))}
        </div>
        <label className="absolute left-2 top-[-1ex] z-10 bg-white px-2 text-xs text-gray-400">
          writing style
        </label>
      </div>
      <div className="relative mb-4">
        <div className="relative flex justify-center rounded-md border-2 border-gray-200 px-2 pt-1">
          <FormControl>
            <RadioGroup
              row={true}
              defaultValue="default"
              value={levelOfDetail}
              onChange={handleLevelOfDetailChange}
              name="level of detail"
            >
              {levelsOfDetail.map((v, i) => (
                <FormControlLabel
                  key={i}
                  value={v}
                  control={<Radio size="small" color="success" />}
                  label={v}
                  classes={{ label: "text-xs text-gray-500" }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
        <label className="absolute left-2 top-[-1ex] z-10 bg-white px-2 text-xs text-gray-400">
          level of detail
        </label>
      </div>
      <div className="relative mb-4">
        <InputBase
          type="text"
          className="relative rounded-md border-2 border-gray-200 px-2 pt-2 text-sm text-gray-500 transition-all duration-500 ease-in-out"
          color="secondary"
          title="Prompt refinement"
          placeholder={`e.g. explain like I'm ten years old`}
          fullWidth={true}
          size="small"
          multiline={true}
          rows={2}
          onChange={(e) => setPromptRefinementString(e.target.value)}
          value={promptRefinementString}
        />
        <label className="absolute left-2 top-[-1ex] z-10 bg-white px-2 text-xs text-gray-400">
          prompt
        </label>
      </div>
      <div className="flex items-center justify-between">
        <Button
          variant="outlined"
          className="flex h-7 w-16 rounded-md border-2 border-gray-200 py-1 text-gray-500 transition-all duration-500 ease-in-out hover:border-gray-50 hover:bg-gray-50"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
        <Button
          variant="outlined"
          className="flex h-7 w-16 rounded-md border-2 border-gray-200 py-1 text-gray-500 transition-all duration-500 ease-in-out hover:border-gray-50 hover:bg-gray-50"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          variant="outlined"
          className="flex h-7 w-16 rounded-md border-2 border-gray-200 py-1 text-gray-500 transition-all duration-500 ease-in-out hover:border-gray-50 hover:bg-gray-50"
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
