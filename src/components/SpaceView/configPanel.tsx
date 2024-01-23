"use client";
import React, { useCallback } from "react";
import * as d3 from "d3";
import Button from "@mui/material-next/Button";
import InputBase from "@mui/material/InputBase";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
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

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 6,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 12,
    width: 12,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export const ConfigPanel = (props: { content: string; type: string }) => {
  const [promptRefinementString, setPromptRefinementString] = useState(
    "please make it more humorous",
  );

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
    setPromptRefinementString("");
  };

  const handleApply = () => {
    // TODO
  };

  return (
    <div className="configPanel ml-3 mt-0 flex w-full flex-col">
      <div className="text-space mb-2 flex h-[10.7rem] w-full overflow-scroll rounded border-2 border-white bg-neutral-100 bg-opacity-100 p-3  pt-2 text-xs leading-5 hover:border-neutral-200 hover:shadow">
        {/* <div className="text-space mb-2 flex h-[10rem] w-full overflow-scroll rounded border-2 border-white bg-neutral-100 bg-opacity-100 p-3  pt-2 text-xs leading-5 hover:border-neutral-200 hover:shadow"> */}
        {blockContent || props.content}
        {/* </div> */}
      </div>
      <div className="h-[6rem] w-full">
        <div className="mb-3">
          <InputBase
            type="text"
            className="rounded-md border-2 border-gray-200 p-2 py-1 text-gray-500 transition-all duration-500 ease-in-out"
            color="secondary"
            title="Prompt refinement"
            placeholder={`Prompt here for detail refinement...\ne.g. Make this node's text more humorous/detailed`}
            fullWidth={true}
            multiline={true}
            rows={4}
            size="small"
            onChange={(e) => setPromptRefinementString(e.target.value)}
            value={promptRefinementString}
          />
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
    </div>
  );
};
