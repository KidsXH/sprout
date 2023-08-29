import {ChatCompletionFunctions} from 'openai';

import {overview, summarize, readSteps, nextStep, writeStep} from "@/server/openai/functions/code";

export const functions: Array<ChatCompletionFunctions> = [
  // overview,
  // summarize,
  // readSteps,
  // nextStep,
  writeStep,
];

export default functions;

const f1 = {
  name: 'explain_code_snippet_all',
  description: 'Explain a code snippet by several steps',
  parameters: {
    type: 'object',
    properties: {
      n_steps: {
        type: 'integer',
        description: 'Number of steps to explain the code snippet',
      },
      explanations: {
        type: 'array',
        items: {
          type: 'object',
          description: 'Explanations to use',
          properties: {
            explanation: {
              type: 'string',
              description: 'Explanation to use',
            },
            target_code: {
              type: 'string',
              description: 'Code snippet to explain',
            },
            start_line_number: {
              type: 'integer',
              description: 'Start line number of the code snippet to explain',
            },
            end_line_number: {
              type: 'integer',
              description: 'End line number of the code snippet to explain',
            },
          },
        },
      },
    },
  },
};

const f2 = {
  name: 'explain_next_step',
  description: 'Explain the next step of the programming tutorial by the previous steps',
  parameters: {
    type: 'object',
    properties: {
      prevSteps: {
        type: 'array',
        items: {
          type: 'object',
          description: 'Previous steps',
          properties: {
            step: {
              type: 'string',
              description: 'Step number',
            },
            code: {
              type: 'string',
              description: 'Code snippet of the step',
            },
            stepType: {
              type: 'string',
              description: 'Type of the step, e.g. "[Start]", "[Finish]", "[Loop]"',
            },
            text: {
              type: 'string',
              description: 'Explanation of the step',
            },
          }
        }
      },
      nextStep: {
        type: 'object',
        description: 'Next step',
        properties: {
          step: {
            type: 'string',
            description: 'Step number',
          },
          code: {
            type: 'string',
            description: 'Code snippet of the step',
          },
          stepType: {
            type: 'string',
            description: 'Type of the step, e.g. "[Start]", "[Finish]", "[Loop]"',
          },
          text: {
            type: 'string',
            description: 'Explanation of the step',
          },
        },
      },
    },
  },
}