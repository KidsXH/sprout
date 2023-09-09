import TextBlock from "@/components/TextBlock";

// import runLLM from '@/server/openai/chain';
import ClientLog from "../ModelViewer/log";

import { planner } from "@/server/openai/agents/planner";
import chain from "@/mocks/chain";
import { node } from "@/mocks/nodes";
// const getResults = async () => await runLLM();

export const TextView = async () => {
  const result = await planner.solve("", true);
  // const argsString = result?.data.choices[0].message?.function_call?.arguments;
  const argsString = undefined;
  const args = argsString ? JSON.parse(argsString) : undefined;
  return (
    <div className="flex flex-col w-3/5 bg-white  m-0.5 p-1 ml-0 pt-0 mt-0">
      <div className="flex text-xl font-bold p-1 h-12 pt-0 text-neutral-600 items-center select-none">
        Document
      </div>
      <div className="h-[28rem] overflow-auto pr-2">
        {
          // args ? (
          //   <>
          //     {args.prevSteps.map((item: any, id: number) => (
          //       <TextBlock
          //         key={id}
          //       >{`${item.step}: ${item.stepType} ${item.text}`}</TextBlock>
          //     ))}
          //     {/* <TextBlock>{`${args.nextStep.step}: ${args.nextStep.stepType} ${args.nextStep.text}`}</TextBlock> */}
          //   </>
          // ) : (
          //   <>
          //     <TextBlock>{"Step X"}</TextBlock>
          //     <TextBlock>{"Step X"}</TextBlock>
          //     <TextBlock>{"Step X"}</TextBlock>
          //     <TextBlock>{"Step X"}</TextBlock>
          //     <TextBlock>{"Step X"}</TextBlock>
          //     <TextBlock>{"Step X"}</TextBlock>
          //     <TextBlock>{"Step X"}</TextBlock>
          //   </>
          // )
          chain.map((item: node, id: number) => (
            // <TextBlock key={id}>{`${item.content[item.contentID]}`}</TextBlock>
            <TextBlock key={id}>{`${
              item.content[item.contentID].content
            }`}</TextBlock>
          ))
        }
      </div>
      <ClientLog content={result} />
    </div>
  );
};

export default TextView;
