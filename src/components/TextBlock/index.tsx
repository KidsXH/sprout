import { dispatch } from "d3";

import { updateHighlightNode } from "@/store/highlightSlice";
import { useAppDispatch } from "@/hooks/redux";
import { PropsWithChildren } from "react";

export const TextBlock = (props: {
  index: number;
  role?: string;
  children?: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    // console.log(props);
    dispatch(updateHighlightNode(props.index));
  };
  return props.role === "placeholder" ? (
    <PlaceholderBlock>{props.children}</PlaceholderBlock>
  ) : (
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

const PlaceholderBlock = (props: PropsWithChildren<{}>) => {
  return (
    <div className="text-block mb-2 flex w-full justify-center rounded-sm bg-neutral-100 bg-opacity-100 p-2 text-center text-gray-400">
      {props.children}
    </div>
  );
};
