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
import votingPrompt from "./prompts/voting.txt";

export class BaseModel {
  openai: OpenAI;
  model: string;
  systemMessage?: ChatCompletionSystemMessageParam;
  chatMessages: ChatCompletionMessageParam[] = [];
  functions?: Array<ChatCompletionTool>;
  temperature = 1;
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
      // model: this.model,
      model: "gpt-3.5-turbo-1106",
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
      // seed: 0,
    });
  }

  async call() {
    const chatCompletion = await this.chatComplete(this.chatMessages);
    console.log("[Response]", chatCompletion);
    return chatCompletion.choices[0].message;
  }
}

export class RefineModel {
  openai: OpenAI;
  model: string;
  systemMessage?: ChatCompletionSystemMessageParam;
  chatMessages: ChatCompletionMessageParam[] = [];
  functions?: Array<ChatCompletionTool>;
  temperature = 1.0;
  stop = ["\n1.Observation"];

  constructor(apiKey: string, modelName: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
    this.model = modelName;
  }

  async retriveRefinedContent(prompt: string, content: string, type: string) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant.Your job is to help developers refine programming tutorials content according to developer's requirements. return the refined content directly, do not add other words. \n ",
        },
        {
          role: "system",
          content:
            "\n Now refine the " +
            "title" +
            ", which is a part of the tutorial: \n",
        },
        {
          role: "system",
          content: "\n This is the content needed to be refined: \n" + content,
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo-1106",
      stream: true,
      // response_format: { type: "json_object" },
    });

    console.log("[api.ts] res", completion);

    return completion;
  }
}

export class VotingModel {
  openai: OpenAI;
  model: string;
  systemMessage?: ChatCompletionSystemMessageParam;
  chatMessages: ChatCompletionMessageParam[] = [];
  functions?: Array<ChatCompletionTool>;
  temperature = 1;
  stop = ["\n1.Observation"];

  constructor(apiKey: string, modelName: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
    this.model = modelName;
  }

  async vote(choices: { id: number; content: string; key: string }[]) {
    let choice_content = "";
    choices.forEach((choice, index) => {
      choice_content += "choice" + index + ": " + choice.content + "\n";
    });
    console.log("[api.ts] voting content", choice_content);
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: votingPrompt,
        },

        {
          role: "system",
          content: "Here is the choices: \n" + choice_content,
        },

        // { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      // seed: 0,
    });

    console.log("[api.ts] voting completion content", completion.choices[0]);
    return completion.choices[0].message;
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
