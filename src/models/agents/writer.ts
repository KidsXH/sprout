export const TutorialContentTypes = [
  "title",
  "background",
  "explanation",
  "notification",
  "summary",
];

export type TutorialContent = {
  type: "title" | "background" | "explanation" | "notification" | "summary";
  content: string;
  targetCode: string;
};

export class Writer {
  tutorial?: string;
  tutorialContent: TutorialContent[] = [];

  constructor() {
    this.tutorial = "";
  }

  writeTitle({ title }: { title: string }) {
    this.tutorialContent.push({
      type: "title",
      content: title,
      targetCode: "",
    });
    this.tutorial += `[Title] ${title}\n`;
    return `The title has been added to the tutorial.\nCurrent Tutorial:\n${this.tutorial}`;
  }

  writeBackground({ background }: { background: string }) {
    this.tutorialContent.push({
      type: "background",
      content: background,
      targetCode: "",
    });
    this.tutorial += `[Background] ${background}\n`;
    return `The background has been added to the tutorial.\nCurrent Tutorial:\n${this.tutorial}`;
  }

  writeExplanation({
    stepNum,
    explanation,
    code,
  }: {
    stepNum: string;
    explanation: string;
    code: string;
  }) {
    this.tutorialContent.push({
      type: "explanation",
      content: explanation,
      targetCode: code,
    });
    this.tutorial += `[STEP ${stepNum}] ${explanation}\n`;
    return `The explanation has been added to the tutorial.\nCurrent Tutorial:\n${this.tutorial}`;
  }

  writeNotification({
    notification,
    code,
  }: {
    notification: string;
    code: string;
  }) {
    this.tutorialContent.push({
      type: "notification",
      content: notification,
      targetCode: code,
    });
    this.tutorial += `[NOTE] ${notification}\n`;
    return `The notification has been added to the tutorial.\nCurrent Tutorial:\n${this.tutorial}`;
  }

  writeSummary({ summary }: { summary: string }) {
    this.tutorialContent.push({
      type: "summary",
      content: summary,
      targetCode: "",
    });
    this.tutorial += `[Summary] ${summary}\n`;
    return `The summary has been added to the tutorial.\nCurrent Tutorial:\n${this.tutorial}`;
  }

  writeNothing() {
    return `The tutorial is not changed.`;
  }

  finishTutorial() {
    return `The tutorial is finished.`;
  }

  generateTutorial() {
    this.tutorial = this.tutorialContent
      .map((step) => {
        if (step.type === "background") {
          return `Background: ${step.content}`;
        } else if (step.type === "explanation") {
          return `${step.content}`;
        } else if (step.type === "notification") {
          return `NOTE: ${step.content}`;
        } else if (step.type === "summary") {
          return `Summary: ${step.content}`;
        }
      })
      .join("\n");
  }

  exportChainNodes() {
    return this.tutorialContent.map((item, index) => {
      return {
        index: index,
        type: item.type,
        content: item.content,
      };
    });
  }

  async callFunction(functionName: string, functionArgs: any) {
    const functionToCall = (this as { [key: string]: any })[functionName];

    if (!functionToCall) {
      throw new Error(`[Writer] Function ${functionName} not found`);
    }
    console.log("[Function Call]", functionName, functionArgs);
    return (this as { [key: string]: any })[functionName](functionArgs);
  }

  get lastContent() {
    return this.tutorialContent[this.tutorialContent.length - 1];
  }
}
