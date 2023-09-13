import { memo, useState } from "react";

const LLMSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <span className="pointer-events-none relative left-7 top-3 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
      </span>
      <div
        className="cursor-pointer rounded-md border-2 py-1 pl-9 pr-4 transition-all duration-500 ease-in-out hover:border-gray-50 hover:bg-gray-50"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        GPT-3.5-turbo
      </div>
      {isOpen ? (
        <>
          <div
            className="absolute left-0 top-0 z-10 h-screen w-screen bg-white opacity-0"
            onClick={() => {
              setIsOpen(false);
            }}
          ></div>
          <div className="absolute z-20 mx-auto">
            <div className="relative -left-48 top-12 flex w-96 items-center rounded-lg bg-white p-4 shadow-md transition-all duration-500 ease-in-out">
              <span className="px-2">OPENAI_API_KEY</span>
              <input
                className="text-security-disc rounded-md border-2 px-2 py-1"
                type="text"
                autoComplete="off"
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(LLMSettings);
