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

const NUM_PLANNERS = 5;

type PlannerMutations = {
  setupBaseModel: (apiKey: string, modelName: string) => void;
};

type PlannerContextValue = [Planner[], PlannerMutations];

const PlannerContext = createContext<PlannerContextValue | null>(null);

const PlannerProvider = (props: PropsWithChildren<{}>) => {
  const [planners, setPlanners] = useState<Planner[]>(
    Array(5)
      .fill(null)
      .map((item, index) => new Planner(index, "", "")),
  );

  const setupBaseModel = useCallback((apiKey: string, modelName: string) => {
    setPlanners((planners) => {
      planners.forEach((p) => p.setup(apiKey, modelName));
      return planners;
    });
  }, []);

  const value = useMemo(() => {
    return [planners, { setupBaseModel }] as [Planner[], PlannerMutations];
  }, [planners, setupBaseModel]);

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
