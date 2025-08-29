export type ProjectStage = 'Definición' | 'Desarrollo Local' | 'Ambiente DEV' | 'Ambiente TST' | 'Ambiente UAT' | 'Soporte Productivo' | 'Cerrado';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type Delivery = {
  id: string;
  projectId: string;
  projectName: string;
  deliveryNumber: number;
  stage: ProjectStage;
  budget: number;
  estimatedDate: string;
  owner: {
    name: string;
    avatar: string;
  };
  isArchived?: boolean;
  errorCount?: number;
  errorSolutionTime?: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  stage: ProjectStage;
  riskLevel: RiskLevel;
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
  }>;
};
