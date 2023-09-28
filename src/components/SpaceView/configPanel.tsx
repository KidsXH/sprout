"use client";
import React from "react";
import * as d3 from "d3";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setCommand } from "@/store/modelSlice";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
const styles = ["Academic", "Humorous", "Objective", "Other"];

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
  const [sentenceValue, setSentenceValue] = useState(4);
  const [style, setStyle] = useState("Academic");

  const [selectedIndex, setSelectedIndex] = useState(0);

  const bigRectWidth = 150;
  const bigRectHeight = 72;
  const textOffsetY = (bigRectHeight / 4) * 3;
  const codeRangeOffsetX = 15;
  const codeRangeOffsetY = 25;
  const nodeRectData: { color: string; range: number[]; text: string } = {
    color: "#C6EBD4",
    range: [2, 4],
    text: "node",
  };
  const dispatch = useAppDispatch();

  const handleClick = () => {
    // setTimeout(() => {
    //   dispatch(setCommand("polish"));
    //   // dispatch
    //   // set polish style
    // }, 200);
  };

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
          nodeRectData.range[0] +
          (nodeRectData.range[0] === nodeRectData.range[1]
            ? ""
            : "-" + nodeRectData.range[1]),
      );
  }, []);

  useEffect(() => {
    const buttons = document.getElementsByClassName("style-button");
    if (buttons.length === 0) return;
    buttons[selectedIndex].classList.add("selectedStyleButtonStyle");

    return () => {
      if (buttons.length === 0) return;
      buttons[selectedIndex].classList.remove("selectedStyleButtonStyle");
    };
  }, [selectedIndex]);
  return (
    <div className="ml-3 mt-0 flex w-full flex-col">
      <div className="flex w-full ">
        {/* <svg
          className="h-[5rem] w-[10rem] "
          id="node-space"
          onClick={() => {
            // handleBranchClick();
          }}
        ></svg>
        <div className="flex w-20 flex-col">
          <div className="m-1 text-center">Type</div>
          <div className="flex h-8 w-20 items-center justify-center  border-2 border-solid border-black bg-green-100 text-xs">
            Explanation
          </div>
        </div> */}
        <div className="mb-2 flex h-[4.5rem] w-full overflow-scroll rounded border-2 border-white bg-neutral-100 bg-opacity-100 p-3 pt-2  text-xs leading-5 hover:border-neutral-200 hover:shadow">
          {props.content}
        </div>
      </div>
      <div className="h-[15rem] w-full rounded-md border-2 border-solid border-gray-100">
        <div className="polish m-2 mb-3">
          <div className="p-1 text-base">Polishing</div>
          <div className="p-1 text-sm text-gray-600"> Make it more</div>
          <div className="grid grid-flow-col grid-rows-2 gap-3">
            {styles.map((v, i) => (
              <div
                className="style-button flex h-5  w-full  items-center justify-center text-xs text-slate-500 underline decoration-gray-200 decoration-solid decoration-4 underline-offset-1"
                key={i}
                onClick={() => {
                  setSelectedIndex(i);
                  setStyle(v);
                }}
              >
                {v}
              </div>
            ))}
            {/* <div className="flex h-5  w-full items-center justify-center ">
              <input
                className=" h-5  w-10 text-xs text-slate-500 underline decoration-gray-200 decoration-solid decoration-4 underline-offset-0"
                type="text"
                defaultValue={"?"}
              />
            </div> */}
          </div>
          <div className="mt-1 p-1 text-base">Level of Details</div>
          {/* <div className="flex flex-row">
            <PrettoSlider
              className="basis-1/2"
              defaultValue={4}
              marks={true}
              min={1}
              max={3}
              step={1}
              onChange={(e, v) => setSentenceValue(v as number)}
            />
            
            <span className="flex items-center justify-center pl-5 text-sm text-gray-400">
              {(sentenceValue == 1
                ? "Low"
                : sentenceValue == 2
                ? "Medium"
                : "High") + " Level"}
            </span>
          </div> */}
          <FormControl>
            {/* <FormLabel id="demo-radio-buttons-group-label">Sentences</FormLabel> */}
            <RadioGroup
              row={true}
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="same"
              name="radio-buttons-group"
              // size="small"
            >
              <FormControlLabel
                value="less"
                control={<Radio size="small" color="success" />}
                label="less"
              />
              <FormControlLabel
                value="same"
                control={<Radio size="small" color="success" />}
                label="same"
              />
              <FormControlLabel
                value="more"
                control={<Radio size="small" color="success" />}
                label="more"
              />
            </RadioGroup>
          </FormControl>
          <div></div>
        </div>

        <div className="confirmButton  flex items-center justify-center">
          <div
            className="flex  h-7  w-16 items-center justify-center rounded-md border-2 border-gray-200 bg-gray-100 text-xs"
            onClick={handleClick}
          >
            Confirm
          </div>
        </div>
      </div>
    </div>
  );
};
