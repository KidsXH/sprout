import { BaseModel } from "@/models/api";
import teacherPrompt from "@/models/prompts/teacher.txt";

export class TeacherAgent {
  llm: BaseModel;
  sourceCode?: string;
  tutorial?: string;
  currentSteps: { stepNum: string; code: string; text: string }[] = [];

  constructor() {
    this.llm = new BaseModel("");
    const systemPrompt = teacherPrompt;

    this.llm.systemMessage = {
      role: "system",
      content: systemPrompt,
    };
  }

  async writeStep({
    stepNum,
    code,
    text,
  }: {
    stepNum: string;
    code: string;
    text: string;
  }) {
    this.currentSteps.push({ stepNum, code, text });
    const tutorial = this.currentSteps
      .map((step) => `${step.stepNum}. ${step.text}`)
      .join("\n");
    const explainedCode = this.currentSteps.map((step) => step.code).join("\n");
    return `Step ${stepNum} has been added to the tutorial.\n[Current Tutorial]\n${tutorial}\n\n[Explained Code]\n${explainedCode}`;
  }

  async callFunction(functionName: string, functionArgs: any) {
    const functionToCall = (this as { [key: string]: any })[functionName];

    if (!functionToCall) {
      throw new Error(`Function ${functionName} not found`);
    }

    return (this as { [key: string]: any })[functionName](functionArgs);
  }
}
