// import {llmResult} from '../../server/langchain/chain'
// import result from '../../server/openai/chain'
import ClientLog from './log'
export default function ModelViewer() {
  return (
    <div className='flex-col border-solid border-1 border-gray-200 w-3/4 items-center justify-end text-left bg-white shadow-sm'>
      <div className='text-xl font-semibold p-2 border-b-2'>Model Viewer</div>
      <div className="flex flex-row flex-wrap text-left">
        <div className='h-48 w-[28rem] shadow-md p-2 ml-2 mt-2'>Inputs:</div>
        <div className='h-48 w-[28rem] shadow-md p-2 ml-2 mt-2' >Prompts:</div>
        <div className='h-48 w-[28rem] shadow-md p-2 ml-2 mt-2'>Chains:</div>
        <div className='h-48 w-[28rem] shadow-md p-2 ml-2 mt-2'>Agents:</div>
        {/* <div className='h-48 w-[28rem] shadow-md p-2 ml-2 mt-2 mb-2'>Outputs: {result.data.choices[0].message?.content}</div>
        <ClientLog content={result.data}></ClientLog> */}
      </div>
    </div>
  );
}
