import {PromptTemplate} from 'langchain/prompts';
import {formatInstructions} from './output_parser';
import { } from 'langchain/tools';

export const prompt = new PromptTemplate({
  template:
    'Answer the users question as best as possible.\n{format_instructions}\n{question}',
  inputVariables: ['question'],
  partialVariables: {format_instructions: formatInstructions},
});
