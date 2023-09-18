import { useAppSelector } from "@/hooks/redux";
import { useEffect, useState } from "react";
import { BaseModel } from "@/models/api";
import { Planner } from "@/models/agents/planner";
import { ChatCompletionRequestMessage } from "openai";

export const usePlanner = (apiKey: string, modelName: string) => {
  const model = new BaseModel(apiKey);
  model.model = modelName;
  return new Planner(model, reportFn);
};

const reportFn = (message: any) => {
  console.log("[Report]", message);
};
