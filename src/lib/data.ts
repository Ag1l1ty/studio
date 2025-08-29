import type { Project, ProjectStage, Delivery } from './types';
import { subDays, addDays } from 'date-fns';

let MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Digital Onboarding Platform',
    description: 'Development of a new digital onboarding experience for clients.',
    stage: 'Desarrollo Local',
    riskLevel: 'Medium',
    budget: 500000,
    budgetSpent: 275000,
    projectedDeliveries: 20,
    startDate: '2024-01-15',
    endDate: '2024-09-30',
    owner: { name: 'Ana Rodriguez', avatar: '/avatars/01.png' },
    metrics: [
      { month: 'Jan', deliveries: 5, errors: 2, budget: 55000, spent: 50000 },
      { month: 'Feb', deliveries: 8, errors: 1, budget: 55000, spent: 60000 },
      { month: 'Mar', deliveries: 12, errors: 3, budget: 55000, spent: 52000 },
      { month: 'Apr', deliveries: 10, errors: 4, budget: 55000, spent: 58000 },
      { month: 'May', deliveries: 15, errors: 2, budget: 55000, spent: 55000 },
      { month: 'Jun', deliveries: 18, errors: 1, budget: 55000, spent: 54000 },
    ],
  },
  {
    id: 'PRJ-002',
    name: 'AI-Powered Claims Processing',
    description: 'Implementing an AI model to automate insurance claims processing.',
    stage: 'Ambiente TST',
    riskLevel: 'High',
    budget: 1200000,
    budgetSpent: 950000,
    projectedDeliveries: 10,
    startDate: '2023-11-01',
    endDate: '2024-12-31',
    owner: { name: 'Carlos Gomez', avatar: '/avatars/02.png' },
    metrics: [
      { month: 'Jan', deliveries: 2, errors: 5, budget: 100000, spent: 110000 },
      { month: 'Feb', deliveries: 3, errors: 8, budget: 100000, spent: 120000 },
      { month: 'Mar', deliveries: 4, errors: 6, budget: 100000, spent: 95000 },
      { month: 'Apr', deliveries: 5, errors: 4, budget: 100000, spent: 105000 },
      { month: 'May', deliveries: 5, errors: 3, budget: 100000, spent: 98000 },
      { month: 'Jun', deliveries: 6, errors: 2, budget: 100000, spent: 102000 },
    ],
  },
  {
    id: 'PRJ-003',
    name: 'Mobile App Refresh',
    description: 'Complete UI/UX overhaul for the main customer-facing mobile app.',
    stage: 'Soporte Productivo',
    riskLevel: 'Low',
    budget: 350000,
    budgetSpent: 345000,
    projectedDeliveries: 30,
    startDate: '2023-09-01',
    endDate: '2024-05-30',
    owner: { name: 'Sofia Fernandez', avatar: '/avatars/03.png' },
    metrics: [
      { month: 'Jan', deliveries: 20, errors: 1, budget: 40000, spent: 38000 },
      { month: 'Feb', deliveries: 25, errors: 0, budget: 40000, spent: 40000 },
      { month: 'Mar', deliveries: 22, errors: 1, budget: 40000, spent: 41000 },
      { month: 'Apr', deliveries: 18, errors: 0, budget: 40000, spent: 39000 },
      { month: 'May', deliveries: 15, errors: 0, budget: 40000, spent: 40000 },
      { month: 'Jun', deliveries: 2, errors: 0, budget: 10000, spent: 10000 },
    ],
  },
  {
    id: 'PRJ-004',
    name: 'Internal CRM System',
    description: 'New CRM system for the sales and marketing teams.',
    stage: 'Definición',
    riskLevel: 'Medium',
    budget: 750000,
    budgetSpent: 50000,
    projectedDeliveries: 15,
    startDate: '2024-06-01',
    endDate: '2025-06-30',
    owner: { name: 'Luis Martinez', avatar: '/avatars/04.png' },
    metrics: [
        { month: 'Jun', deliveries: 0, errors: 0, budget: 50000, spent: 50000 },
    ],
  },
  {
    id: 'PRJ-005',
    name: 'Data Warehouse Migration',
    description: 'Migrating legacy data warehouse to a cloud-based solution.',
    stage: 'Cerrado',
    riskLevel: 'Low',
    budget: 400000,
    budgetSpent: 390000,
    projectedDeliveries: 8,
    startDate: '2023-05-01',
    endDate: '2024-02-28',
    owner: { name: 'Elena Petrova', avatar: '/avatars/05.png' },
    metrics: [
        { month: 'Jan', deliveries: 10, errors: 0, budget: 50000, spent: 50000 },
        { month: 'Feb', deliveries: 5, errors: 0, budget: 40000, spent: 40000 },
    ],
  },
  {
    id: 'PRJ-006',
    name: 'Cybersecurity Audit Tool',
    description: 'A tool for internal teams to perform regular security audits.',
    stage: 'Ambiente DEV',
    riskLevel: 'Medium',
    budget: 250000,
    budgetSpent: 110000,
    projectedDeliveries: 12,
    startDate: '2024-03-01',
    endDate: '2024-10-31',
    owner: { name: 'Javier Nuñez', avatar: '/avatars/06.png' },
    metrics: [
      { month: 'Mar', deliveries: 2, errors: 1, budget: 30000, spent: 28000 },
      { month: 'Apr', deliveries: 4, errors: 0, budget: 30000, spent: 30000 },
      { month: 'May', deliveries: 5, errors: 1, budget: 30000, spent: 32000 },
      { month: 'Jun', deliveries: 5, errors: 0, budget: 30000, spent: 20000 },
    ],
  },
];

const today = new Date();
let MOCK_DELIVERIES: Delivery[] = [
    { 
        id: 'DLV-001', 
        projectId: 'PRJ-001', 
        projectName: 'Digital Onboarding Platform', 
        deliveryNumber: 13, 
        stage: 'Desarrollo Local', 
        budget: 25000, 
        budgetSpent: 10000, 
        creationDate: subDays(today, 20).toISOString(), 
        estimatedDate: '2024-07-15', 
        lastBudgetUpdate: subDays(today, 3).toISOString(), 
        owner: { name: 'Ana Rodriguez', avatar: '/avatars/01.png' },
        budgetHistory: [
            { date: subDays(today, 15).toISOString(), amount: 5000 },
            { date: subDays(today, 3).toISOString(), amount: 10000 },
        ]
    },
    { id: 'DLV-002', projectId: 'PRJ-001', projectName: 'Digital Onboarding Platform', deliveryNumber: 14, stage: 'Definición', budget: 25000, budgetSpent: 0, creationDate: subDays(today, 2).toISOString(), estimatedDate: '2024-07-30', owner: { name: 'Ana Rodriguez', avatar: '/avatars/01.png' } },
    { 
      id: 'DLV-003', 
      projectId: 'PRJ-002', 
      projectName: 'AI-Powered Claims Processing', 
      deliveryNumber: 7, 
      stage: 'Ambiente TST', 
      budget: 150000, 
      budgetSpent: 95000, 
      creationDate: subDays(today, 60).toISOString(), 
      estimatedDate: addDays(today, 30).toISOString(), 
      owner: { name: 'Carlos Gomez', avatar: '/avatars/02.png' },
      stageDates: {
        'Definición': subDays(today, 58).toISOString(),
        'Desarrollo Local': subDays(today, 40).toISOString(),
        'Ambiente DEV': subDays(today, 15).toISOString(),
        'Ambiente TST': addDays(today, 5).toISOString(), // This stage is delayed
      },
      budgetHistory: [
        { date: subDays(today, 30).toISOString(), amount: 40000 },
        { date: subDays(today, 10).toISOString(), amount: 95000 },
      ]
    },
    { id: 'DLV-004', projectId: 'PRJ-006', projectName: 'Cybersecurity Audit Tool', deliveryNumber: 6, stage: 'Ambiente DEV', budget: 20000, budgetSpent: 20000, creationDate: subDays(today, 30).toISOString(), estimatedDate: '2024-07-20', owner: { name: 'Javier Nuñez', avatar: '/avatars/06.png' } },
    { id: 'DLV-005', projectId: 'PRJ-004', projectName: 'Internal CRM System', deliveryNumber: 1, stage: 'Definición', budget: 75000, budgetSpent: 0, creationDate: subDays(today, 1).toISOString(), estimatedDate: '2024-09-01', owner: { name: 'Luis Martinez', avatar: '/avatars/04.png' }, lastBudgetUpdate: subDays(today, 10).toISOString() },
    { 
      id: 'DLV-006', 
      projectId: 'PRJ-002', 
      projectName: 'AI-Powered Claims Processing', 
      deliveryNumber: 8, 
      stage: 'Ambiente TST', 
      budget: 120000, 
      budgetSpent: 10000, 
      creationDate: subDays(today, 15).toISOString(), 
      estimatedDate: '2024-08-15', 
      owner: { name: 'Carlos Gomez', avatar: '/avatars/02.png' }, 
      errorCount: 5, 
      errorSolutionTime: 2 
    },
];


export function getProjects(): Project[] {
  // Return a copy to avoid mutation of the original array
  return JSON.parse(JSON.stringify(MOCK_PROJECTS));
}

export function addProject(project: Project) {
    MOCK_PROJECTS.push(project);
}


export function getProjectById(id: string): Project | undefined {
    // This is a bit of a hack for a mock API, but it allows us to "update" the project
    // by returning a reference to the object in the array.
    return MOCK_PROJECTS.find(p => p.id === id);
}

export function getProjectsByStage(stage: ProjectStage): Project[] {
    return MOCK_PROJECTS.filter(p => p.stage === stage);
}


export function getDeliveries(): Delivery[] {
  return JSON.parse(JSON.stringify(MOCK_DELIVERIES));
}

export function getDeliveryById(id: string): Delivery | undefined {
    return MOCK_DELIVERIES.find(d => d.id === id);
}


export function addDelivery(delivery: Delivery) {
    MOCK_DELIVERIES.push(delivery);
}


export function getDashboardKpis(projects: Project[]) {
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const onTrackProjects = projects.filter(p => p.riskLevel === 'Low').length;
    const highRiskProjects = projects.filter(p => p.riskLevel === 'High').length;
    const totalDeliveries = projects.flatMap(p => p.metrics).reduce((sum, m) => sum + m.deliveries, 0);
    
    return {
        totalBudget,
        onTrackProjects,
        highRiskProjects,
        totalDeliveries,
        onTrackPercentage: projects.length > 0 ? Math.round((onTrackProjects / projects.filter(p => p.stage !== 'Cerrado').length) * 100) : 0,
    }
}

export const aggregateMetrics = (projects: Project[]) => {
    const monthlyData: { [key: string]: { deliveries: number; errors: number } } = {};
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    projects.forEach(project => {
        project.metrics.forEach(metric => {
            if (!monthlyData[metric.month]) {
                monthlyData[metric.month] = { deliveries: 0, errors: 0 };
            }
            monthlyData[metric.month].deliveries += metric.deliveries;
            monthlyData[metric.month].errors += metric.errors;
        });
    });

    return monthOrder
        .filter(month => monthlyData[month])
        .map(month => ({
            name: month,
            deliveries: monthlyData[month].deliveries,
            errors: monthlyData[month].errors,
        }));
};
