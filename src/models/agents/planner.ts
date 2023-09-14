import { ChatCompletionRequestMessage } from "openai";
import { TeacherAgent } from "@/models/agents/teacher";
import { BaseModel } from "@/models/api";
import plannerPrompt from "@/models/prompts/planner.txt";
import functions from "@/models/functions";

const MAX_ROUND = 6;

export class Planner {
  llm: BaseModel;
  teacher: TeacherAgent;
  nrRound = 0;

  constructor(model: BaseModel) {
    this.llm = model;

    this.llm.systemMessage = {
      role: "system",
      content: plannerPrompt,
    };

    this.llm.functions = functions;

    this.teacher = new TeacherAgent();
  }

  async solve(sourceCode: string, offline?: boolean) {
    if (offline) {
      return null;
    }
    const userPrompt = `Code snippet:\n${sourceCode}\n`;
    this.llm.chatMessages = [
      {
        role: "user",
        content: userPrompt,
      },
    ];
    this.nrRound = 0;
    return await this.run();
  }

  async run(): Promise<ChatCompletionRequestMessage> {
    const responseMessage = await this.llm.call();

    if (!responseMessage) {
      throw new Error("No response from LLM");
    }
    console.log(`[Response${this.nrRound++}]`, responseMessage);

    if (
      responseMessage.content?.includes("Finish.") ||
      this.nrRound > MAX_ROUND
    ) {
      return responseMessage;
    }

    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name || "";
      const functionArgs = JSON.parse(
        responseMessage.function_call.arguments || "{}",
      );
      const functionResult = await this.teacher.callFunction(
        functionName,
        functionArgs,
      );

      this.llm.chatMessages.push(responseMessage);
      this.llm.chatMessages.push({
        role: "function",
        name: functionName,
        content: functionResult,
      });
      return await this.run();
    }

    return responseMessage;
  }
}
