import { ChatCompletionFunctions } from "openai";

export const writeStep: ChatCompletionFunctions = {
  name: "writeStep",
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
      text: {
        type: "string",
        description: "Text description for the code snippet",
      },
    },
  },
};
