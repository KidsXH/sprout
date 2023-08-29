import {llm} from './api';
import functions from './functions';
import {systemMessage} from './prompts';
import fs from 'fs';
import {join} from 'path';

llm.systemMessage = systemMessage;
llm.functions = functions;

const codeWrapper = "```";
const basePath = join(process.cwd(), 'src', 'server', 'openai', 'code');
export const sourceCode = fs.readFileSync(join(basePath, 'qs.py'), 'utf-8');
// const preSteps = '1. [Start]\n2.[General] Initialize left to 0 and right to len(arr) - 1.\n';
const preSteps = '1. Initialize the boundary of the search space, left and right, to 0 and len(arr) - 1, respectively.\n';
// const userPrompt = `## Code Snippet\n${sourceCode}\n\n## Previous Steps\n${preSteps}\n\n## Next Step\n}`;
const userPrompt = `Code Snippet:\n${codeWrapper}\n${sourceCode}\n${codeWrapper}\n\nTutorial:\n${preSteps}\n\nQuestion: What is the next step?\nThought 1:`;

// console.log(userPrompt);

// const runLLM = async (offline?: boolean) =>
//   offline
//     ? null
//     : await llm.chatComplete([
//         {
//           role: 'user',
//           content: userPrompt,
//         },
//       ]);

// export default runLLM;
