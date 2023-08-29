import {ChatCompletionFunctions, ChatCompletionRequestMessage, Configuration, OpenAIApi,} from 'openai';
import {HttpsProxyAgent} from 'https-proxy-agent';
import {FunctionArgs} from "@/server/openai/actions/generation";

require('dotenv').config();

const proxy = process.env.GLOBAL_AGENT_HTTP_PROXY || '';
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    baseOptions: {
      proxy: false,
      httpAgent: new HttpsProxyAgent(proxy),
      httpsAgent: new HttpsProxyAgent(proxy),
    },
  },
);

export class LLM {
  openai: OpenAIApi;
  model: string;
  systemMessage?: ChatCompletionRequestMessage;
  chatMessages: ChatCompletionRequestMessage[] = [];
  functions?: Array<ChatCompletionFunctions>;
  nrRound = 0;

  constructor() {
    this.openai = new OpenAIApi(configuration);
    this.model = 'gpt-3.5-turbo-16k';
    // this.model = 'gpt-4';
  }

  async chatComplete(messages: ChatCompletionRequestMessage[]) {
    const fullMessages = this.systemMessage
      ? [this.systemMessage, ...messages]
      : messages;
    return await this.openai.createChatCompletion({
      model: this.model,
      messages: fullMessages,
      functions: this.functions,
      temperature: 0.7,
      stop: ["\n1. Observation"],
    });
  }

  async call() {
    const chatCompletion = await this.chatComplete(this.chatMessages);
    return chatCompletion.data.choices[0].message;
  }
}

export const llm = new LLM();

export default llm;

