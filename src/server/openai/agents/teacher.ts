import {LLM} from "@/server/openai/api";
import teacherPrompt from "@/server/openai/prompts/teacher.txt";

export class TeacherAgent {
  llm: LLM;
  sourceCode?: string;
  tutorial?: string;
  currentSteps: {stepNum: string, code: string, text: string}[] = [];

  constructor() {
    this.llm = new LLM();
    const systemPrompt = teacherPrompt;

    this.llm.systemMessage = {
      role: 'system',
      content: systemPrompt,
    }
  }

  async overview({code}: {code: string}) {
    const userPrompt = `[Code Snippet]\n${code}\n\nQuestion: Give an overview description of the code snippet.`;
    this.llm.chatMessages = [
      {
        role: 'user',
        content: userPrompt,
      }
    ];
    const response = await this.llm.call();
    console.log('[Teacher]', response);
    return response?.content;
  }

  async readSteps({code, tutorial}: {code: string, tutorial: string}) {
    const prefixPrompt = `[Code Snippet]\n${code}\n------------\n[Tutorial]\n${tutorial}\n------------\n`;
    const userPrompt = `${prefixPrompt}Question: Read each step in [Tutorial]. Summarize each step in one or two words and tell which part of the code snippet has been explained in [Tutorial]. [Tutorial] may be incomplete. DON’T write steps that are not in [Tutorial].`;
    this.llm.chatMessages = [
      {
        role: 'user',
        content: userPrompt,
      }
    ];
    const response = await this.llm.call();
    console.log('[Teacher]', response);
    return response?.content;
  }

  async nextStep({code, tutorial, codeToExplain}: {code: string, tutorial: string, codeToExplain: string}) {
    const prefixPrompt = `[Code Snippet]\n${code}\n\n[Tutorial]\n${tutorial}\n\n`;
    const userPrompt = `${prefixPrompt}Question: Please explain the following code snippet as a new step in [Tutorial]:\n${codeToExplain}\n The output should include the index of step consistent with [Tutorial]`;
    this.llm.chatMessages = [
      {
        role: 'user',
        content: userPrompt,
      }
    ];
    const response = await this.llm.call();
    console.log('[Teacher]', response);
    return response?.content;
  }

  async writeStep({stepNum, code, text}: {stepNum: string, code: string, text: string}) {
    this.currentSteps.push({stepNum, code, text});
    const tutorial = this.currentSteps.map(step => `${step.stepNum}. ${step.text}`).join('\n');
    const explainedCode = this.currentSteps.map(step => step.code).join('\n');
    const response = `Step ${stepNum} has been added to the tutorial.\n[Current Tutorial]\n${tutorial}\n\n[Explained Code]\n${explainedCode}`;
    return response;
  }

  async callFunction(functionName: string, functionArgs: any) {
    const functionToCall = (this as {[key:string]:any})[functionName];

    if (!functionToCall) {
      throw new Error(`Function ${functionName} not found`);
    }

    // const functionResult = (this as {[key:string]:any})[functionName](functionArgs);

    return (this as {[key:string]:any})[functionName](functionArgs);
  }
}
