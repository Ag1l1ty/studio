import type { Project, ProjectStage } from './types';

let MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Digital Onboarding Platform',
    description: 'Development of a new digital onboarding experience for clients.',
    stage: 'Desarrollo Local',
    riskLevel: 'Medium',
    budget: 500000,
    budgetSpent: 275000,
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

export function getProjects(): Project[] {
  // Return a copy to avoid mutation of the original array
  return JSON.parse(JSON.stringify(MOCK_PROJECTS));
}

export function addProject(project: Project) {
    MOCK_PROJECTS.push(project);
}


export function getProjectById(id: string): Project | undefined {
    return MOCK_PROJECTS.find(p => p.id === id);
}

export function getProjectsByStage(stage: ProjectStage): Project[] {
    return MOCK_PROJECTS.filter(p => p.stage === stage);
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
