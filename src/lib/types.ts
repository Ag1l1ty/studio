export type ProjectStage = 'Definición' | 'Desarrollo Local' | 'Ambiente DEV' | 'Ambiente TST' | 'Ambiente UAT' | 'Soporte Productivo' | 'Cerrado';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type Project = {
  id: string;
  name: string;
  description: string;
  stage: ProjectStage;
  riskLevel: RiskLevel;
  budget: number;
  budgetSpent: number;
  startDate: string;
  endDate: string;
  owner: {
    name: string;
    avatar: string;
  };
  metrics: Array<{
    month: string;
    deliveries: number;
    errors: number;
    budget: number;
    spent: number;
  }>;
};
