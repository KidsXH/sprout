import {ChatCompletionFunctions} from 'openai';

export const overview: ChatCompletionFunctions = {
  name: 'overview',
  description: 'Give an overview description of the code snippet',
  parameters: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'Code snippet to explain',
      }
    }
  }
}

export const readSteps: ChatCompletionFunctions = {
  name: 'readSteps',
  description: 'Read step-by-step explanations in the tutorial. The tutorial is a list of steps, which may be empty or incomplete.',
  parameters: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'Code snippet to explain',
      },
      tutorial: {
        type: 'string',
        description: 'The step-by-step explanations for the code snippet',
      }
    }
  }
}

export const writeStep: ChatCompletionFunctions = {
  name: 'writeStep',
  description: 'Write a text description for a part of code in the tutorial.',
  parameters: {
    type: 'object',
    properties: {
      stepNum: {
        type: 'string',
        description: 'The step number, such as 1, 1.1, 1.2, 2, 2.1, ...',
      },
      code: {
        type: 'string',
        description: 'Part of the code snippet to explain. The code must be a contiguous block of lines.',
      },
      text: {
        type: 'string',
        description: 'Text description for the code snippet',
      },
    }
  }
}

export const summarize: ChatCompletionFunctions = {
  name: 'summarize',
  description: 'Summarize all steps',
  parameters: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'Code snippet to explain',
      },
      allSteps: {
        type: 'string',
        description: 'All steps',
      }
    }
  }
}

export const nextStep: ChatCompletionFunctions = {
  name: 'nextStep',
  description: 'Insert a new step to the tutorial',
  parameters: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'Full code snippet to explain',
      },
      tutorial: {
        type: 'string',
        description: 'The step-by-step explanations for the code snippet',
      },
      codeToExplain: {
        type: 'string',
        description: 'Code snippet to explain in the next step',
      }
    }
  }
}