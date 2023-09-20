"use client";

import { Planner } from "@/models/agents/planner";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type PlannerMutations = {
  setupBaseModel: (apiKey: string, modelName: string) => void;
};

type PlannerContextValue = [Planner, PlannerMutations];

const PlannerContext = createContext<PlannerContextValue | null>(null);

const PlannerProvider = (props: PropsWithChildren<{}>) => {
  const [planner, setPlanner] = useState<Planner>(new Planner("", ""));

  const setupBaseModel = useCallback((apiKey: string, modelName: string) => {
    setPlanner((planner) => {
      planner.setup(apiKey, modelName);
      return planner;
    });
  }, []);

  const value = useMemo(() => {
    return [planner, { setupBaseModel }] as [Planner, PlannerMutations];
  }, [planner, setupBaseModel]);

  return (
    <PlannerContext.Provider value={value}>
      {props.children}
    </PlannerContext.Provider>
  );
};

const usePlannerContext = (): PlannerContextValue => {
  const plannerContext = useContext(PlannerContext);

  if (plannerContext === null) {
    throw new Error(
      `The \`usePlanner\` hook must be used inside the <PlannerProvider> component's context.`,
    );
  }

  return plannerContext;
};

export { PlannerProvider, usePlannerContext };
