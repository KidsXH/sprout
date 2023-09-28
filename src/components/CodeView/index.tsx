"use client";
import CodeEditor from "@/components/CodeView/codeEditor";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useRef, MutableRefObject } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setCommand } from "@/store/modelSlice";

export const CodeView = () => {
  const myRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setCommand("next-plan"));
  };
  return (
    <div className="m-0.5 mt-0 flex flex-col bg-white p-1 pt-0 text-left">
      <div className="flex h-12 w-[28rem] select-none items-center p-1 pt-0 text-xl font-bold text-green-900">
        Code
      </div>
      <div className="static">
        {" "}
        <div
          className="h-[28rem] overflow-auto bg-neutral-100 bg-opacity-100 shadow-md"
          id="code-editor"
          ref={myRef}
        >
          <CodeEditor />
        </div>
        <Fab
          className="color-green-900 relative left-[28rem] top-[-3.5rem]"
          color="default"
          aria-label="add"
          size="small"
          onClick={handleClick}
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
};

export default CodeView;
