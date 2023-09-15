import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectRunningState, setCommand } from "@/store/modelSlice";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import Tooltip from "@mui/material/Tooltip";
import { FastForward, Pause, RefreshRounded } from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const LLMController = () => {
  const runningState = useAppSelector(selectRunningState);
  const dispatch = useAppDispatch();

  const [toggle, setToggle] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const handleStart = () => {
    setTimeout(() => {
      setToggle(!toggle);
    }, 200);
    dispatch(setCommand("run"));
  };
  return (
    <>
      <div className="ml-2 flex items-center">
        {toggle ? <StartButton onClick={handleStart} /> : <GeneratingButton />}

        {toggle ? (
          <PauseButton disabled={true} />
        ) : isPaused ? (
          <ContinueButton
            onClick={() => {
              setTimeout(() => {
                setIsPaused(false);
              }, 200);
            }}
          />
        ) : (
          <PauseButton
            onClick={() => {
              setTimeout(() => {
                setIsPaused(true);
              }, 200);
            }}
          />
        )}
      </div>
    </>
  );
};

export default LLMController;

export const StartButton = (props: { onClick?: any }) => {
  return (
    <>
      <Tooltip title="Start Generation" enterDelay={1000}>
        <Button
          variant="outlined"
          startIcon={<PlayArrowRoundedIcon className="fill-green-500" />}
          className="mr-2 w-28 rounded-md border-2 border-gray-200 py-1 pr-8 text-gray-500 transition-all duration-500 ease-in-out hover:border-gray-50 hover:bg-gray-50"
          onClick={props.onClick}
        >
          Generate
        </Button>
      </Tooltip>
    </>
  );
};

export const GeneratingButton = (props: { onClick?: any }) => {
  return (
    <>
      <Tooltip title="Generating" enterDelay={1000}>
        <Button
          variant="outlined"
          startIcon={
            <CircularProgress
              className="p-1 text-green-500"
              color="inherit"
              size={20}
            />
          }
          className="mr-2 w-28 rounded-md border-2 border-green-100 bg-green-50 py-1 pr-8 text-gray-500 transition-all duration-500 ease-in-out hover:border-green-200 hover:bg-green-200"
          onClick={props.onClick}
        >
          Generate
        </Button>
      </Tooltip>
    </>
  );
};

export const RestartButton = (props: { onClick?: any }) => {
  return (
    <>
      <Tooltip title="Restart Generation" enterDelay={1000}>
        <Button
          variant="outlined"
          startIcon={<RefreshRounded className="fill-green-500" />}
          className="mr-2 w-28 rounded-md border-2 border-green-100 bg-green-50 py-1 text-gray-500 transition-all duration-500 ease-in-out hover:border-green-200 hover:bg-green-200"
          onClick={props.onClick}
        >
          Restart
        </Button>
      </Tooltip>
    </>
  );
};

export const ContinueButton = (props: { onClick?: any }) => {
  return (
    <>
      <Tooltip title="Continue Generation" enterDelay={1000}>
        <Button
          variant="outlined"
          startIcon={<FastForward className="fill-sky-500" />}
          className="w-32 rounded-md border-2 border-gray-200 py-1 text-gray-500 transition-all duration-500 ease-in-out hover:border-gray-50 hover:bg-gray-50"
          onClick={props.onClick}
        >
          Continue
        </Button>
      </Tooltip>
    </>
  );
};

export const PauseButton = (props: { onClick?: any; disabled?: boolean }) => {
  return (
    <>
      {props.disabled ? (
        <>
          <Button
            variant="outlined"
            startIcon={<Pause className="fill-gray-400" />}
            className="w-32 cursor-not-allowed justify-between rounded-md border-2 border-gray-200 py-1 text-gray-500 transition-all duration-500 ease-in-out hover:border-gray-50 hover:bg-gray-50"
          >
            Pause
          </Button>
        </>
      ) : (
        <>
          <Tooltip title="Pause Generation" enterDelay={1000}>
            <Button
              variant="outlined"
              startIcon={<Pause className="fill-sky-500" />}
              className="w-32 justify-between rounded-md border-2 border-gray-200 py-1 text-gray-500 transition-all duration-500 ease-in-out hover:border-gray-50 hover:bg-gray-50"
              onClick={props.onClick}
            >
              Pause
            </Button>
          </Tooltip>
        </>
      )}
    </>
  );
};
