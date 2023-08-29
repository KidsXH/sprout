import {llm} from './llm';
import {prompt} from './prompt';

const input = await prompt.format({
  question: 'What is the capital of France?',
});

const predict = async (prompt: string) => {
  const result = await llm.predict(prompt);
  return result;
};

const result = predict(
  'What would be a good company name for a company that makes colorful socks?'
);

export const llmResult = result;
