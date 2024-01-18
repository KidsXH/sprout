"use client";
import React from "react";
import * as d3 from "d3";
import Button from "@mui/material-next/Button";
import InputBase from '@mui/material/InputBase';
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
import { BaseModel } from "@/models/api";

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

export const ConfigPanel = (props: { content: string }) => {
  const [promptRefinementString, setPromptRefinementString] = useState("");

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

  useEffect(() => {
    const currentTreeNode = treeNodes.find((node) =>
      node.requestID.includes(focusChatID),
    );
    // TODO: populate node data;
  }, [focusChatID, treeNodes])

  const dispatch = useAppDispatch();
  const apiKey = useAppSelector(selectApiKey);
  const model = useAppSelector(selectModelName);

  const handleConfirm = () => {
    // TODO
  };
  
  const handleReset = () => {
    setPromptRefinementString("")
  };
  
  const handleApply = () => {
    // TODO
  };


  // const openai = new OpenAIApi(
  //   new Configuration({
  //     apiKey: apiKey,
  //   }),
  // );

  // async function polish() {
  //   const completion = await openai.createChatCompletion({
  //     model: model,
  //     messages: fullMessages,

  //     stream: true,
  //   });

  //   for await (const chunk of completion) {
  //     console.log(chunk.choices[0].delta.content);
  //   }
  // }

  useEffect(() => {
    const svg = d3.select("#node-space");
    svg.selectAll("*").remove();
    svg

      .append("rect")
      .attr("class", "branch-node-shadow")
      .attr("x", (d) => 0)
      .attr("y", (d, i) => 0)
      .attr("width", (d) => bigRectWidth)
      .attr("height", (d) => bigRectHeight)
      .attr("fill", (d) => nodeRectData.color)
      .attr("rx", 16)
      .attr("ry", 16);

    svg

      .append("rect")
      .attr("class", "branch-node")
      .attr("x", (d) => 0)
      .attr("y", (d) => 0)
      .attr("width", (d) => bigRectWidth)
      .attr("height", (d) => bigRectHeight - 5)
      .attr("fill", "#f5f5f5")
      .attr("rx", 14)
      .attr("ry", 14);

    //render branch node text
    svg

      .append("rect")
      .attr("class", "branch-node-text select-none")
      .attr("x", (d) => 0 + 15)
      .attr("y", (d, i) => 0 + textOffsetY)
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .attr("font-size", "14px")
      .text((d) => nodeRectData.text);

    //render code range
    svg

      .append("text")
      .attr("class", "code-range-text select-none")
      .attr("x", (d) => 0 + codeRangeOffsetX)
      .attr("y", (d, i) => 0 + codeRangeOffsetY)
      .attr("fill", "#000")
      .attr("font-size", "14px")
      .attr("text-anchor", "start")
      .text(
        (d) =>
          //empty string if branch uninitialised
          nodeRectData.range[0] == 0 ? "" :
          //construct if initialised
          nodeRectData.range[0] +
          (nodeRectData.range[0] === nodeRectData.range[1]
            ? ""
            : "-" + nodeRectData.range[1]),
      );
  }, []);

  return (
    <div className="ml-3 mt-0 flex w-full flex-col">
      <div className="flex w-full">
        <svg
          className="h-[5rem] w-full mb-3"
          id="node-space"
          onClick={() => {
            // handleBranchClick();
          }}
        ></svg>
      </div>
      <div className="h-[15rem] w-full">
        <div className="mb-3">
          <InputBase 
            type="text" 
            className="p-2 rounded-md border-2 border-gray-200 py-1 text-gray-500 transition-all duration-500 ease-in-out" 
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
