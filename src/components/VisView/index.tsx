"use client";

import { llmResults } from "@/server/mock";
import { useEffect, useState, useRef, MutableRefObject } from "react";
import nodes from "@/mocks/nodes";
import { BranchView } from "@/components/BranchView";
import { SpaceView } from "@/components/SpaceView";

import * as d3 from 'd3';

import data from '@/mocks/treeNodeData'
import OutlineView from "@/components/VisView/outline";

export const VisView = () => {
  return (
    <>
      <div className="flex bg-white w-full h-full m-1 shadow-sm p-1">
        <div className="flex flex-col">
          <div className="flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none text-green-900">
            Outline
          </div>
          <OutlineView />
        </div>
        <BranchView />
        <SpaceView />
        {/* 
        <div className="flex flex-col w-[32rem]">
          <div className="flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none">
            Branches
          </div>
          <svg
            className="w-[32rem] h-full"
            id="ToT-branch"
            onClick={() => {
              // handleBranchClick();
            }}
          ></svg>
        </div> */}
        {/* <div className="flex flex-col">
          <div className="flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none">
            Context
          </div>
          <div className="flex h-full">
            <svg
              className="w-[16rem] h-full flex-col"
              id="ToT-space"
              onClick={() => {
                // handleBranchClick();
              }}
            ></svg>
            <div className="flex flex-col  h-full">config panel</div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default VisView;
