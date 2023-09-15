import { useAppSelector } from "@/hooks/redux";
import { useEffect, useState } from "react";
import { BaseModel } from "@/models/api";
import { Planner } from "@/models/agents/planner";

export const useLLM = () => {
  const apiKey = useAppSelector((state) => state.model.apiKey);
  const modelName = useAppSelector((state) => state.model.modelName);
  const [model, setModel] = useState<BaseModel | null>(null);
  const [planner, setPlanner] = useState<Planner | null>(null);

  useEffect(() => {
    const newModel = new BaseModel(apiKey);
    newModel.model = modelName;
    setModel(newModel);
  }, [apiKey, modelName]);

  useEffect(() => {
    if (model) {
      const newPlanner = new Planner(model);
      setPlanner(newPlanner);
    }
  }, [model]);

  return planner;
};
