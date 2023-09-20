import {
  ChatCompletionFunctions,
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai";

export class BaseModel {
  openai: OpenAIApi;
  model: string;
  systemMessage?: ChatCompletionRequestMessage;
  chatMessages: ChatCompletionRequestMessage[] = [];
  functions?: Array<ChatCompletionFunctions>;
  temperature = 1.0;
  stop = ["\n1.Observation"];

  constructor(apiKey: string, modelName: string) {
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    this.openai = new OpenAIApi(configuration);
    this.model = modelName;
  }

  async chatComplete(messages: ChatCompletionRequestMessage[]) {
    const fullMessages = this.systemMessage
      ? [this.systemMessage, ...messages]
      : messages;
    console.log("[Request]", {
      model: this.model,
      messages: fullMessages,
      functions: this.functions,
      function_call: "auto",
      temperature: this.temperature,
      stop: this.stop,
    });
    return await this.openai.createChatCompletion({
      model: this.model,
      messages: fullMessages,
      functions: this.functions,
      function_call: "auto",
      temperature: this.temperature,
      stop: this.stop,
    });
  }

  async call() {
    const chatCompletion = await this.chatComplete(this.chatMessages);
    return chatCompletion.data.choices[0].message;
  }
}
