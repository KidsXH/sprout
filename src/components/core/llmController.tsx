import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectRunningState, setCommand } from "@/store/modelSlice";
import Spinner from "@/ui/Spinner";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const LLMController = () => {
  const runningState = useAppSelector(selectRunningState);
  const dispatch = useAppDispatch();
  const handlePlay = () => {
    dispatch(setCommand("run"));
  };
  return (
    <>
      <div className="ml-2 flex items-center">
        {runningState === "stopped" ? (
          <Tooltip title="Run">
            <IconButton className="h-8 w-8" onClick={handlePlay}>
              <PlayArrowRoundedIcon className="fill-green-500" />
            </IconButton>
          </Tooltip>
        ) : runningState === "running" ? (
          <>
            <Tooltip title="Running">
              <IconButton className="h-8 w-8 p-1">
                <Spinner />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <div>Unknown</div>
        )}
      </div>
    </>
  );
};

export default LLMController;
