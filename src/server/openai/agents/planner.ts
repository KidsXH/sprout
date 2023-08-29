import {LLM} from "@/server/openai/api";

import plannerPrompt from "@/server/openai/prompts/planner.txt";
import {TeacherAgent} from "@/server/openai/agents/teacher";
import functions from "@/server/openai/functions";
import {ChatCompletionRequestMessage} from "openai";

import {sourceCode} from "@/server/openai/chain";

const tutorial = "1. Initialize the boundary of the search space, left and right, to 0 and len(arr) - 1, respectively.";
const MAX_ROUND = 6;
export class Planner {
  llm: LLM;
  teacher: TeacherAgent;
  nrRound = 0;

  constructor() {
    this.llm = new LLM();

    this.llm.systemMessage = {
      role: 'system',
      content: plannerPrompt,
    }

    this.llm.functions = functions;

    this.teacher = new TeacherAgent();
  }

  async solve(goal: string, offline?: boolean) {
    if (offline) {
      return null;
    }
    // const userPrompt = `[Code Snippet]\n${sourceCode}\n\n[Tutorial]\n${tutorial}\n\n1.Goal: ${goal}`;
    const userPrompt = `Code snippet:\n${sourceCode}\n`;
    this.llm.chatMessages = [
      {
        role: 'user',
        content: userPrompt,
      }
    ];
    this.nrRound = 0;
    return await this.run();
  }

  async run(): Promise<ChatCompletionRequestMessage> {
    const responseMessage = await this.llm.call();

    if (!responseMessage) {
      throw new Error('No response from LLM');
    }
    console.log(`[Response${this.nrRound++}]`, responseMessage);

    if (responseMessage.content?.includes('Finish.') || this.nrRound > MAX_ROUND) {
      return responseMessage;
    }

    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name || '';
      const functionArgs = JSON.parse(responseMessage.function_call.arguments || '{}');
      const functionResult = await this.teacher.callFunction(functionName, functionArgs);

      this.llm.chatMessages.push(responseMessage);
      this.llm.chatMessages.push({
          role: 'function',
          name: functionName,
          content: functionResult,
        }
      );
      return await this.run();
    }

    return responseMessage;
  }
}

export const planner = new Planner();