import { dispatch } from "d3";

import { updateHighlightNode } from "@/store/highlightSlice";
import { useAppDispatch } from "@/hooks/redux";

export const TextBlock = (props: {
  index: number;
  children?: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    // console.log(props);
    dispatch(updateHighlightNode(props.index));
  };
  return (
    <div
      className="text-block mb-2 flex w-full rounded-sm bg-neutral-100 bg-opacity-100 p-2"
      contentEditable="true"
      onClick={handleClick}
      suppressContentEditableWarning={true}
    >
      {props.children}
    </div>
  );
};

export default TextBlock;
