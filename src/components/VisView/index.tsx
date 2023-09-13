"use client";

import { BranchView } from "@/components/BranchView";
import { SpaceView } from "@/components/SpaceView";
import OutlineView from "@/components/VisView/outline";

export const VisView = () => {
  return (
    <>
      <div className="m-1 flex h-full w-full bg-white p-1 shadow-sm">
        <div className="flex flex-col">
          <div className="flex h-12 select-none items-center p-1 text-xl font-bold text-green-900">
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
