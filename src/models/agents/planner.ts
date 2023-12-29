// import { ChatCompletionRequestMessage } from "openai";
import { BaseModel } from "@/models/api";
import { TutorialContent, Writer } from "@/models/agents/writer";
import plannerPrompt from "@/models/prompts/planner-v2.txt";
import plannerPromptGpt4 from "@/models/prompts/planner-gpt4.txt";
import functions from "@/models/functions";
import {
  ChatCompletionMessageParam,
  ChatCompletionAssistantMessageParam,
  ChatCompletionToolMessageParam,
} from "openai/resources";

export class Planner {
  llm: BaseModel;
  writer: Writer;
  channel = 0;
  id: number;

  constructor(id: number, apiKey: string, modelName: string) {
    this.id = id;
    this.llm = new BaseModel(apiKey, modelName);

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

  setMemory(
    requestMemory: ChatCompletionMessageParam[],
    tutorialMemory: TutorialContent[],
  ) {
    if (requestMemory.length > 0) {
      this.llm.chatMessages = [...requestMemory];
    }
    if (tutorialMemory.length > 0) {
      this.writer.tutorialContent = [...tutorialMemory];
      this.writer.generateTutorial();
    }
  }

  initialize(sourceCode: string, channel: number) {
    console.log(`[Planner] set channel=${channel}`);
    this.channel = channel;
    const userPrompt = `Code snippet:\n${sourceCode}\n`;
    this.llm.chatMessages = [
      {
        role: "user",
        content: userPrompt,
      },
    ];
  }

  async next() {
    let responseMessage = await this.llm.call();
    let parsedMessage = parseMessage(responseMessage);

    if (!responseMessage || !parsedMessage) {
      console.log("[Planner] Bad response:", responseMessage);
      console.log("[Planner] retry");
      this.llm.chatMessages.push({
        role: "user",
        content: 'Continue with explicit "Observation/Thought/Action"',
      });
      responseMessage = await this.llm.call();
      parsedMessage = parseMessage(responseMessage);
      if (!responseMessage || !parsedMessage) {
        console.log("[Planner] Bad response:", responseMessage);
        throw new Error("Bad response from LLM");
      }
    }

    this.llm.chatMessages.push(responseMessage);
    console.log("[Planner] responseMessage", responseMessage);

    if (responseMessage.tool_calls) {
      const functionName = responseMessage.tool_calls[0].function.name || "";
      const functionArgs = JSON.parse(
        responseMessage.tool_calls[0].function.arguments || "{}",
      );
      const functionResult = await this.writer.callFunction(
        functionName,
        functionArgs,
      );

      const functionResponse: ChatCompletionToolMessageParam = {
        tool_call_id: responseMessage.tool_calls[0].id,
        role: "tool",
        // name: functionName,
        content: functionResult,
      };

      this.llm.chatMessages.push(functionResponse);

      if (functionName === "finishTutorial") {
        console.log("[Planner] finish");
        return {
          hasNext: false,
          id: this.id,
        };
      }
    }

    return {
      hasNext: true,
      id: this.id,
    };
  }

  async nextWithPlan(planPrompt?: string) {
    if (planPrompt === undefined) {
      planPrompt =
        "You are supposed to explain the code `distances = {node: 32767 for node in graph}` in the next step. Please write the observation, thought, and action for the next step.";
    }
    this.llm.chatMessages.push({
      role: "user",
      content: planPrompt,
    });
    return await this.next();
  }

  planPrompt4CodeExplain(code: string, lineNumber: [number, number]) {
    const [start, end] = lineNumber;
    const codeLines = code.split("\n");
    const codeSnippet = codeLines.slice(start - 1, end).join("\n");
    return `You are supposed to explain the code \`\`\`${codeSnippet}\`\`\` in the next step. Please write the observation, thought, and action for the next step.`;
  }
}

export const parseMessage = (
  message: ChatCompletionMessageParam | undefined,
) => {
  if (!message || !message.content) {
    return;
  }

  const matchObservation = (message.content as string).match(
    /Observation: (.*)\n/,
  );
  const matchThought = (message.content as string).match(/Thought: (.*)\n/);
  const matchAction = (message.content as string).match(/Action: (.*)/);

  if (!matchObservation || !matchThought || !matchAction) {
    return;
  }

  const observation = matchObservation[1];
  const thought = matchThought[1];
  const action = matchAction[1];

  return { observation, thought, action };
};
