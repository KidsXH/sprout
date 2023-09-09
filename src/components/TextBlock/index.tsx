export const TextBlock = (props: { children?: React.ReactNode }) => {
  return (
    <div className="text-block flex w-full bg-neutral-100 bg-opacity-100 p-2 mb-2 rounded-sm">
      {props.children}
    </div>
  );
};

export default TextBlock;
