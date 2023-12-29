import { OpenAI } from "openai";

import * as writer from "@/models/functions/writer";

export const functions: Array<OpenAI.Chat.Completions.ChatCompletionTool> = [
  writer.writeTitle,
  writer.writeBackground,
  writer.writeExplanation,
  writer.writeNotification,
  writer.writeSummary,
  writer.writeNothing,
  writer.finishTutorial,
];

export default functions;
