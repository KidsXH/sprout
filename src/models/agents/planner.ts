import { ChatCompletionRequestMessage } from "openai";
import { BaseModel } from "@/models/api";
import { Writer } from "@/models/agents/writer";
import plannerPrompt from "@/models/prompts/planner-v2.txt";
import plannerPromptGpt4 from "@/models/prompts/planner-gpt4.txt";
import functions from "@/models/functions";

export class Planner {
  llm: BaseModel;
  writer: Writer;
  reportFn?: (message: any) => void;

  constructor(
    apiKey: string,
    modelName: string,
    reportFn?: (message: any) => void,
  ) {
    this.llm = new BaseModel(apiKey, modelName);
    this.reportFn = reportFn;

    this.llm.systemMessage = {
      role: "system",
      content: modelName.includes("gpt-4") ? plannerPromptGpt4 : plannerPrompt,
    };

    this.llm.stop = ["\n1. Observation", "\n1.Observation"];

    this.llm.functions = functions;

    this.writer = new Writer();
  }

  setup(apiKey: string, modelName: string) {
    this.llm = new BaseModel(apiKey, modelName);
    this.llm.systemMessage = {
      role: "system",
      content: modelName.includes("gpt-4") ? plannerPromptGpt4 : plannerPrompt,
    };
    this.llm.stop = ["\n1. Observation", "\n1.Observation"];
    this.llm.functions = functions;
  }

  initialize(sourceCode: string) {
    console.log("[Planner] setup");
    const userPrompt = `Code snippet:\n${sourceCode}\n`;
    this.llm.chatMessages = [
      {
        role: "user",
        content: userPrompt,
      },
    ];
  }

  async next() {
    console.log("[Planner] next");

    let responseMessage = await this.llm.call();

    if (!responseMessage || !parseMessage(responseMessage)) {
      console.log("[Planner] Bad response:", responseMessage);
      console.log("[Planner] retry");
      this.llm.chatMessages.push({
        role: "user",
        content: 'Continue with explicit "Observation/Thought/Action"',
      });
      responseMessage = await this.llm.call();
      if (!responseMessage || !parseMessage(responseMessage)) {
        console.log("[Planner] Bad response:", responseMessage);
        throw new Error("Bad response from LLM");
      }
    }

    if (this.reportFn) this.reportFn(responseMessage);
    this.llm.chatMessages.push(responseMessage);

    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name || "";
      const functionArgs = JSON.parse(
        responseMessage.function_call.arguments || "{}",
      );
      const functionResult = await this.writer.callFunction(
        functionName,
        functionArgs,
      );

      const functionResponse: ChatCompletionRequestMessage = {
        role: "function",
        name: functionName,
        content: functionResult,
      };

      this.llm.chatMessages.push(functionResponse);

      if (functionName === "finishTutorial") {
        console.log("[Planner] finish");
        return { hasNext: false };
      }
    }

    return { hasNext: true };
  }
}

export const parseMessage = (message: ChatCompletionRequestMessage) => {
  if (!message.content) {
    return;
  }

  const matchObservation = message.content.match(/Observation: (.*)\n/);
  const matchThought = message.content.match(/Thought: (.*)\n/);
  const matchAction = message.content.match(/Action: (.*)/);

  if (!matchObservation || !matchThought || !matchAction) {
    return;
  }

  const observation = matchObservation[1];
  const thought = matchThought[1];
  const action = matchAction[1];

  return { observation, thought, action };
};
