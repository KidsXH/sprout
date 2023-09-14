import {ChatCompletionFunctions, ChatCompletionRequestMessage, Configuration, OpenAIApi,} from 'openai';

export class BaseModel {
  openai: OpenAIApi;
  model: string;
  systemMessage?: ChatCompletionRequestMessage;
  chatMessages: ChatCompletionRequestMessage[] = [];
  functions?: Array<ChatCompletionFunctions>;
  temperature = 0.7;
  stop = ["\n1. Observation"];

  constructor(apiKey: string) {
    const configuration = new Configuration({
      apiKey: apiKey,
    })
    this.openai = new OpenAIApi(configuration);
    this.model = 'gpt-3.5-turbo-16k';
  }

  async chatComplete(messages: ChatCompletionRequestMessage[]) {
    const fullMessages = this.systemMessage
      ? [this.systemMessage, ...messages]
      : messages;
    return await this.openai.createChatCompletion({
      model: this.model,
      messages: fullMessages,
      functions: this.functions,
      temperature: this.temperature,
      stop: this.stop,
    });
  }

  async call() {
    const chatCompletion = await this.chatComplete(this.chatMessages);
    return chatCompletion.data.choices[0].message;
  }
}


