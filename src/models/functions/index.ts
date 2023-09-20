import { ChatCompletionFunctions } from "openai";

import * as writer from "@/models/functions/writer";

export const functions: Array<ChatCompletionFunctions> = [
  writer.writeTitle,
  writer.writeBackground,
  writer.writeExplanation,
  writer.writeNotification,
  writer.writeSummary,
  writer.writeNothing,
  writer.finishTutorial,
];

export default functions;
