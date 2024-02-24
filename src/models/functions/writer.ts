import { OpenAI } from "openai";
import { ChatCompletionTool } from "openai/resources";

export const writeTitle: ChatCompletionTool = {
  function: {
    name: "writeTitle",
    description: "Write a title for the tutorial.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the tutorial.",
        },
      },
    },
  },
  type: "function",
};

export const writeBackground: ChatCompletionTool = {
  function: {
    name: "writeBackground",
    description: "Write a background for the tutorial.",
    parameters: {
      type: "object",
      properties: {
        background: {
          type: "string",
          description: "The background of the tutorial.",
        },
      },
    },
  },
  type: "function",
};

export const writeExplanation: ChatCompletionTool = {
  function: {
    name: "writeExplanation",
    description: "Write a text description for a part of code in the tutorial.",
    parameters: {
      type: "object",
      properties: {
        stepNum: {
          type: "string",
          description: "The step number, such as 1, 1.1, 1.2, 2, 2.1, ...",
        },
        code: {
          type: "string",
          description:
            "Part of the code snippet to explain. The code must be a contiguous block of lines.",
        },
        summary: {
          type: "string",
          description: "brief for this step using 1 or 2 words.",
        },
        explanation: {
          type: "string",
          description: "Text description for the code snippet",
        },
      },
    },
  },
  type: "function",
};

export const writeNotification: ChatCompletionTool = {
  function: {
    name: "writeNotification",
    description: "Write a notification for common mistakes on the code.",
    parameters: {
      type: "object",
      properties: {
        notification: {
          type: "string",
          description: "The notification for common mistakes",
        },
        code: {
          type: "string",
          description: "The code snippet to notify.",
        },
      },
    },
  },
  type: "function",
};

export const writeSummary: ChatCompletionTool = {
  function: {
    name: "writeSummary",
    description: "Write a summary for the tutorial.",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "The summary of the tutorial.",
        },
      },
    },
  },
  type: "function",
};

export const writeNothing: ChatCompletionTool = {
  function: {
    name: "writeNothing",
    description: "Write nothing.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  type: "function",
};

export const finishTutorial: ChatCompletionTool = {
  function: {
    name: "finishTutorial",
    description: "The tutorial is finished. No more actions.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  type: "function",
};
