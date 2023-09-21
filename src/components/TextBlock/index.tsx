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
  return (
    <>
      {props.role === "placeholder" ? (
        <PlaceholderBlock>{props.children}</PlaceholderBlock>
      ) : props.role === "title" ? (
        <TitleBlock>{props.children}</TitleBlock>
      ) : props.role === "background" ? (
        <BackgroundBlock>{props.children}</BackgroundBlock>
      ) : props.role === "notification" ? (
        <NoteBlock>{props.children}</NoteBlock>
      ) : props.role === "summary" ? (
        <SummaryBlock>{props.children}</SummaryBlock>
      ) : (
        <div
          className="text-block mb-2 flex w-full rounded border-2 border-white bg-neutral-100 bg-opacity-100 p-2 text-justify hover:border-neutral-200 hover:shadow"
          contentEditable="true"
          onClick={handleClick}
          suppressContentEditableWarning={true}
        >
          {props.children}
        </div>
      )}
    </>
  );
};

export default TextBlock;

const PlaceholderBlock = (props: PropsWithChildren<{}>) => {
  return (
    <div className="text-block mb-2 flex w-full justify-center rounded bg-neutral-100 bg-opacity-100 p-2 text-center text-gray-400">
      {props.children}
    </div>
  );
};

const TitleBlock = (props: PropsWithChildren<{}>) => {
  return (
    <div className="text-block mb-2 flex w-full rounded border-2 border-white bg-neutral-100 p-2 text-xl font-bold hover:border-neutral-200 hover:shadow">
      {props.children}
    </div>
  );
};

const BackgroundBlock = (props: PropsWithChildren<{}>) => {
  return (
    <div className="text-block mb-2 w-full rounded  border-2 border-white bg-neutral-100 p-2 text-justify hover:border-neutral-200 hover:shadow">
      <p className="">
        <span className="font-bold">Background</span> - {props.children}
      </p>
    </div>
  );
};

const NoteBlock = (props: PropsWithChildren<{}>) => {
  return (
    <div className="text-block my-4 ml-2 rounded-sm border-l-4 pl-4 pr-2 text-justify text-gray-500">
      ℹ️ <span className="text-sm font-bold text-gray-500">NOTE: </span>{" "}
      {props.children}
    </div>
  );
};
const SummaryBlock = (props: PropsWithChildren<{}>) => {
  return (
    <div className="text-block mb-2 flex w-full rounded-sm p-2 text-black">
      {props.children}
    </div>
  );
};
