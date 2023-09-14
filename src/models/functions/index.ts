import { ChatCompletionFunctions } from "openai";

import { writeStep } from "@/models/functions/code";

export const functions: Array<ChatCompletionFunctions> = [writeStep];

export default functions;
