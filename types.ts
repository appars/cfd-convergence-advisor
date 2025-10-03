export enum Likelihood {
  High = "High",
  Medium = "Medium",
  Low = "Low",
}

export interface Assessment {
  overallLikelihood: {
    level: Likelihood;
    reason: string;
  };
  potentialIssues: string[];
  recommendations: string[];
  quickChecklist: string[];
}

export interface SimulationSetup {
  geometry: string;
  velocity: string;
  density: string;
  turbulenceModel: string;
  meshDetails: string;
}

export const TURBULENCE_MODELS = [
  'k-epsilon (RANS)',
  'k-omega SST (RANS)',
  'Spalart-Allmaras (RANS)',
  'Large Eddy Simulation (LES)',
  'Detached Eddy Simulation (DES)',
  'Direct Numerical Simulation (DNS)',
  'Other',
];
