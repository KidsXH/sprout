import { ChatCompletionFunctions } from "openai";

import * as writer from "@/models/functions/writer";

export const functions: Array<ChatCompletionFunctions> = [
  writer.writeTitle,
  writer.writeBackground,
  writer.writeGlossary,
  writer.writeExplanation,
  writer.writeNotification,
  writer.writeSummary,
];

export default functions;
