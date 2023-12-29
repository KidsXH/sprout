import {
  // ChatCompletionFunctions,
  // ChatCompletionRequestMessage,
  // Configuration,
  OpenAI,
} from "openai";
// import {
//   ChatCompletionTool,
//   // ChatCompletionMessageParam,
// } from "openai/resources";
import {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionTool,
} from "openai/resources";

export class BaseModel {
  openai: OpenAI;
  model: string;
  systemMessage?: ChatCompletionSystemMessageParam;
  chatMessages: ChatCompletionMessageParam[] = [];
  functions?: Array<ChatCompletionTool>;
  temperature = 1.0;
  stop = ["\n1.Observation"];

  constructor(apiKey: string, modelName: string) {
    // const configuration = new Configuration({
    //   apiKey: apiKey,
    // });
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
    this.model = modelName;
  }

  async chatComplete(messages: ChatCompletionMessageParam[]) {
    const fullMessages = this.systemMessage
      ? [this.systemMessage, ...messages]
      : messages;
    console.log("[Request]", {
      model: this.model,
      messages: fullMessages,
      tools: this.functions,
      tool_choice: "auto",
      temperature: this.temperature,
      stop: this.stop,
    });
    // return await this.openai.createChatCompletion({
    //   model: this.model,
    //   messages: fullMessages,
    //   functions: this.functions,
    //   function_call: "auto",
    //   temperature: this.temperature,
    //   stop: this.stop,
    // });

    return await this.openai.chat.completions.create({
      messages: fullMessages,
      model: this.model,
      tools: this.functions,
      tool_choice: "auto",
      temperature: this.temperature,
      stop: this.stop,
    });
  }

  async call() {
    const chatCompletion = await this.chatComplete(this.chatMessages);
    console.log("[Response]", chatCompletion);
    return chatCompletion.choices[0].message;
  }
}

export class EmbeddingModel {
  openai: OpenAI;
  model: string;
  user?: string;

  constructor(apiKey: string, modelName: string) {
    // const configuration = new Configuration({
    // apiKey: apiKey,
    // });
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
    this.model = modelName;
  }

  async getEmbeddings(inputs: string[]) {
    const embeddings = await this.openai.embeddings.create({
      model: this.model,
      input: inputs,
    });
    return embeddings.data;
  }
}
