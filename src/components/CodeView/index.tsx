import fs from "fs";
import { join } from "path";
import CodeEditor from "@/components/CodeView/codeEditor";

const basePath = join(process.cwd(), "src", "server", "openai", "code");
const sourceCode = fs.readFileSync(join(basePath, "bs.py"), "utf-8");
export const CodeView = () => {
  return (
    <div className="flex flex-col m-0.5 text-left bg-white p-1">
      <div className="flex w-[28rem] text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none">
        Code View
      </div>
      {/*<div className='font-mono p-2 px-4 whitespace-pre overflow-auto'>*/}
      {/*  {sourceCode}*/}
      {/*</div>*/}
      <div className="h-[28rem] bg-neutral-100 bg-opacity-100 shadow-md">
        <CodeEditor />
      </div>
    </div>
  );
};

export default CodeView;
