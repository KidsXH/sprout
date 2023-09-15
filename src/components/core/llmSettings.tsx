import { memo, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectApiKey,
  selectModelName,
  setApiKey,
  setModelName,
} from "@/store/modelSlice";
import Tooltip from "@mui/material/Tooltip";

const LLMSettings = () => {
  const dispatch = useAppDispatch();
  const modelName = useAppSelector(selectModelName);
  const modelApiKey = useAppSelector(selectApiKey);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [userAPIKey, setUserAPIKey] = useState("");

  useEffect(() => {
    setUserAPIKey(modelApiKey);
  }, [modelApiKey]);

  useEffect(() => {
    setSelectedModel(modelName);
  }, [modelName]);

  const applyModelSettings = useCallback(() => {
    setIsOpen(false);
    dispatch(setModelName(selectedModel));
    dispatch(setApiKey(userAPIKey));
  }, [selectedModel, userAPIKey, dispatch]);

  return (
    <>
      <span className="pointer-events-none relative left-7 top-3 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
      </span>
      <Tooltip title={"LLM Settings"} placement={"top-end"} enterDelay={1000}>
        <div
          className={
            "h-9 w-44 cursor-pointer rounded-md border-2 py-1 pl-9 pr-4 text-center transition-all duration-500 ease-in-out hover:border-gray-50 hover:bg-gray-50 " +
            (isOpen ? "border-gray-50 bg-gray-50" : "")
          }
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {modelName}
        </div>
      </Tooltip>
      <div
        className={
          "absolute left-0 top-0 z-10 h-full w-[1568px] bg-white opacity-0 2xl:w-screen" +
          (isOpen ? "" : " invisible opacity-0")
        }
        onClick={() => {
          setIsOpen(false);
        }}
      ></div>
      <div className="absolute z-20 h-0 w-0">
        <div
          className={
            "relative -left-[200px] top-12 flex w-96 flex-col rounded-lg bg-white p-4 shadow-md transition-all duration-300 ease-in-out" +
            (isOpen ? "" : " invisible opacity-0")
          }
        >
          <div className="mt-2 font-sans text-lg font-bold text-neutral-600">
            LLM Settings
          </div>
          <div className="mt-2 flex items-center">
            <span className="w-[10rem] px-2">Model</span>
            <select
              className="w-[15rem] rounded-md border-2 px-2 py-1.5"
              name={"modelName"}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
              <option value="gpt-4">GPT-4</option>
            </select>
          </div>
          <div className="mt-2 flex items-center">
            <div className="w-[10rem] px-2">OPENAI_API_KEY</div>
            <input
              className="text-security-disc w-[15rem] rounded-md border-2 px-2  py-1"
              type="text"
              autoComplete="off"
              value={userAPIKey}
              onChange={(e) => setUserAPIKey(e.target.value)}
            />
          </div>
          <div className="mt-2 flex items-center justify-end">
            <button
              className="rounded-md bg-sky-500 px-2.5 py-1.5 font-sans text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              onClick={applyModelSettings}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(LLMSettings);
