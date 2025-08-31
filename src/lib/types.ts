export type ProjectStage = 'Definición' | 'Desarrollo Local' | 'Ambiente DEV' | 'Ambiente TST' | 'Ambiente UAT' | 'Soporte Productivo' | 'Cerrado';

export type RiskLevel = 'Muy conservador' | 'Conservador' | 'Moderado' | 'Moderado - alto' | 'Agresivo' | 'Muy Agresivo';

export type BudgetHistoryEntry = {
  date: string;
  amount: number;
};

export type Delivery = {
  id: string;
  projectId: string;
  projectName: string;
  deliveryNumber: number;
  stage: ProjectStage;
  budget: number;
  budgetSpent?: number;
  estimatedDate: string;
  creationDate: string;
  lastBudgetUpdate?: string;
  owner: {
    name: string;
    avatar: string;
  };
  isArchived?: boolean;
  errorCount?: number;
  errorSolutionTime?: number;
  stageDates?: Partial<Record<ProjectStage, string>>;
  budgetHistory?: BudgetHistoryEntry[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  stage: ProjectStage;
  riskLevel: RiskLevel;
  riskScore?: number;
  budget: number;
  budgetSpent: number;
  projectedDeliveries?: number; // Added this field
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
    errorSolutionTime?: number;
  }>;
};
