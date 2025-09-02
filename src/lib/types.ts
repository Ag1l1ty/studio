
export type ProjectStage = 'Definición' | 'Desarrollo Local' | 'Ambiente DEV' | 'Ambiente TST' | 'Ambiente UAT' | 'Soporte Productivo' | 'Cerrado';

export type RiskLevel = 'Muy conservador' | 'Conservador' | 'Moderado' | 'Moderado - alto' | 'Agresivo' | 'Muy Agresivo' | 'No Assessment';

export type Role = 'Admin' | 'PM/SM' | 'Viewer' | 'Portfolio Manager';

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    avatar: string;
    assignedProjectIds?: string[];
    password?: string;
    temporaryPassword?: boolean;
    lastPasswordChange?: string;
};

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
    id: string;
    name: string;
    avatar: string;
  };
  isArchived?: boolean;
  riskAssessed?: boolean;
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
    id: string;
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

export type RiskResult = {
    score: number;
    classification: RiskLevel;
    deviation: string;
}

export type RiskProfile = {
    classification: RiskLevel;
    score: string;
    deviation: string;
}
