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
  temperature = 1.0;
  stop = ["\n1.Observation"];

  constructor(apiKey: string, modelName: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
    this.model = modelName;
  }

  async vote(choices: { id: number; content: string }[]) {
    let choice_content = "";
    choices.forEach((choice) => {
      choice_content += "choice" + choice.id + ": " + choice.content + "\n";
    });
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Given an instruction and several choices, decide which choice is most promising. Analyze each choice in detail, then conclude in the last line 'The best choice is {s}', where s the integer id of the choice.\n choices: \n" +
            choice_content,
        },
        // { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
      // response_format: { type: "json_object" },
    });

    console.log("[api.ts] voting", completion.choices[0]);
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
