import { OpenAI } from "langchain/llms/openai";
import { LLMResult } from "langchain/schema";
import { Serialized } from "langchain/load/serializable";
import { HttpsProxyAgent } from 'https-proxy-agent';

require('dotenv').config();

const proxy = process.env.GLOBAL_AGENT_HTTP_PROXY || '';

export const llm = new OpenAI({
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  callbacks: [
    {
      handleLLMStart: async (llm: Serialized, prompts: string[]) => {
        console.log(JSON.stringify(llm, null, 2));
        console.log(JSON.stringify(prompts, null, 2));
      },
      handleLLMEnd: async (output: LLMResult) => {
        console.log(JSON.stringify(output, null, 2));
      },
      handleLLMError: async (err: Error) => {
        console.error(err);
      },
    },
  ],
},
{
  baseOptions: {
    proxy: false,
    httpAgent: new HttpsProxyAgent(proxy),
    httpsAgent: new HttpsProxyAgent(proxy),
  },
});

export default llm;