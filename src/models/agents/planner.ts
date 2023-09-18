import { ChatCompletionRequestMessage } from "openai";
import { BaseModel } from "@/models/api";
import { Writer } from "@/models/agents/writer";
import plannerPrompt from "@/models/prompts/planner-v2.txt";
import functions from "@/models/functions";

const MAX_ROUND = 8;

export class Planner {
  llm: BaseModel;
  writer: Writer;
  reportFn?: (message: any) => void;
  nrRound = 0;

  constructor(model: BaseModel, reportFn?: (message: any) => void) {
    this.llm = model;
    this.reportFn = reportFn;

    this.llm.systemMessage = {
      role: "system",
      content: plannerPrompt,
    };

    this.llm.stop = ["\n1. Observation", "\n1.Observation"];

    this.llm.functions = functions;

    this.writer = new Writer();
  }

  setup(sourceCode: string) {
    console.log("[Planner] setup");
    const userPrompt = `Code snippet:\n${sourceCode}\n`;
    this.llm.chatMessages = [
      {
        role: "user",
        content: userPrompt,
      },
    ];
    this.nrRound = 0;
  }

  async next() {
    console.log("[Planner] next");
    return true;
  }

  async run(): Promise<ChatCompletionRequestMessage> {
    const responseMessage = await this.llm.call();
    this.nrRound += 1;

    if (this.reportFn) {
      this.reportFn(responseMessage);
    }

    if (!responseMessage) {
      throw new Error("No response from LLM");
    }

    if (
      responseMessage.content?.includes("3.Action: Finish.") ||
      this.nrRound > MAX_ROUND
    ) {
      console.log("[Action Finish]", responseMessage);
      return responseMessage;
    }

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

      this.llm.chatMessages.push({
        role: "function",
        name: functionName,
        content: functionResult,
      });
    }

    return await this.run();
  }
}
