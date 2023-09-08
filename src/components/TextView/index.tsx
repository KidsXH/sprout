import TextBlock from "@/components/TextBlock";

// import runLLM from '@/server/openai/chain';
import ClientLog from "../ModelViewer/log";

import { planner } from "@/server/openai/agents/planner";

// const getResults = async () => await runLLM();

export const TextView = async () => {
  const result = await planner.solve("", true);
  // const argsString = result?.data.choices[0].message?.function_call?.arguments;
  const argsString = undefined;
  const args = argsString ? JSON.parse(argsString) : undefined;
  return (
    <div className="flex flex-col w-3/5 bg-white  m-0.5">
      <div className="flex text-xl font-bold p-1 h-12 text-neutral-600 items-center select-none">
        Document
      </div>
      <div className="overflow-auto pr-2">
        {args ? (
          <>
            {args.prevSteps.map((item: any, id: number) => (
              <TextBlock
                key={id}
              >{`${item.step}: ${item.stepType} ${item.text}`}</TextBlock>
            ))}
            {/* <TextBlock>{`${args.nextStep.step}: ${args.nextStep.stepType} ${args.nextStep.text}`}</TextBlock> */}
          </>
        ) : (
          <>
            <TextBlock>{"Step X"}</TextBlock>
            <TextBlock>{"Step X"}</TextBlock>
            <TextBlock>{"Step X"}</TextBlock>
            <TextBlock>{"Step X"}</TextBlock>
            <TextBlock>{"Step X"}</TextBlock>
            <TextBlock>{"Step X"}</TextBlock>
            <TextBlock>{"Step X"}</TextBlock>
          </>
        )}
      </div>
      <ClientLog content={result} />
    </div>
  );
};

export default TextView;
