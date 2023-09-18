import { ChatCompletionFunctions } from "openai";

export const writeTitle: ChatCompletionFunctions = {
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
};

export const writeBackground: ChatCompletionFunctions = {
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
};

export const writeGlossary: ChatCompletionFunctions = {
  name: "writeGlossary",
  description: "Write a glossary for the tutorial.",
  parameters: {
    type: "object",
    properties: {
      glossary: {
        type: "string",
        description: "The glossary of the tutorial.",
      },
    },
  },
};

export const writeExplanation: ChatCompletionFunctions = {
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
      explanation: {
        type: "string",
        description: "Text description for the code snippet",
      },
    },
  },
};

export const writeNotification: ChatCompletionFunctions = {
  name: "writeNotification",
  description: "Write a notification for common mistakes",
  parameters: {
    type: "object",
    properties: {
      notification: {
        type: "string",
        description: "The notification for common mistakes",
      },
      code: {
        type: "string",
        description:
          "The code snippet to notify. The code must be a contiguous block of lines.",
      },
    },
  },
};

export const writeSummary: ChatCompletionFunctions = {
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
};