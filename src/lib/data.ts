
import type { Project, ProjectStage, Delivery, RiskLevel, RiskResult, Role, User } from './types';
import { subDays, addDays, getMonth, getYear, differenceInMonths, startOfMonth, parseISO, format } from 'date-fns';

let MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Digital Onboarding Platform',
    description: 'Development of a new digital onboarding experience for clients.',
    stage: 'Desarrollo Local',
    riskLevel: 'Moderado',
    riskScore: 10,
    budget: 500000,
    budgetSpent: 275000,
    projectedDeliveries: 20,
    startDate: '2024-01-15',
    endDate: '2024-09-30',
    owner: { name: 'Ana Rodriguez', avatar: '/avatars/01.png' },
    metrics: [
      { month: 'Jan', deliveries: 2, errors: 2, budget: 55000, spent: 50000, errorSolutionTime: 3 },
      { month: 'Feb', deliveries: 3, errors: 1, budget: 55000, spent: 60000, errorSolutionTime: 2 },
      { month: 'Mar', deliveries: 4, errors: 3, budget: 55000, spent: 52000, errorSolutionTime: 4 },
      { month: 'Apr', deliveries: 3, errors: 4, budget: 55000, spent: 58000, errorSolutionTime: 5 },
      { month: 'May', deliveries: 4, errors: 2, budget: 55000, spent: 55000, errorSolutionTime: 3 },
      { month: 'Jun', deliveries: 2, errors: 1, budget: 55000, spent: 54000, errorSolutionTime: 2 },
    ],
  },
  {
    id: 'PRJ-002',
    name: 'AI-Powered Claims Processing',
    description: 'Implementing an AI model to automate insurance claims processing.',
    stage: 'Ambiente TST',
    riskLevel: 'Agresivo',
    riskScore: 18,
    budget: 1200000,
    budgetSpent: 950000,
    projectedDeliveries: 10,
    startDate: '2023-11-01',
    endDate: '2024-12-31',
    owner: { name: 'Carlos Gomez', avatar: '/avatars/02.png' },
    metrics: [
      { month: 'Jan', deliveries: 1, errors: 5, budget: 100000, spent: 110000, errorSolutionTime: 7 },
      { month: 'Feb', deliveries: 1, errors: 8, budget: 100000, spent: 120000, errorSolutionTime: 9 },
      { month: 'Mar', deliveries: 1, errors: 6, budget: 100000, spent: 95000, errorSolutionTime: 8 },
      { month: 'Apr', deliveries: 1, errors: 4, budget: 100000, spent: 105000, errorSolutionTime: 6 },
      { month: 'May', deliveries: 1, errors: 3, budget: 100000, spent: 98000, errorSolutionTime: 5 },
      { month: 'Jun', deliveries: 1, errors: 2, budget: 100000, spent: 102000, errorSolutionTime: 4 },
    ],
  },
  {
    id: 'PRJ-003',
    name: 'Mobile App Refresh',
    description: 'Complete UI/UX overhaul for the main customer-facing mobile app.',
    stage: 'Soporte Productivo',
    riskLevel: 'Muy conservador',
    riskScore: 2,
    budget: 350000,
    budgetSpent: 345000,
    projectedDeliveries: 25,
    startDate: '2023-09-01',
    endDate: '2024-05-30',
    owner: { name: 'Ana Rodriguez', avatar: '/avatars/01.png' },
    metrics: [
      { month: 'Jan', deliveries: 5, errors: 1, budget: 40000, spent: 38000, errorSolutionTime: 1 },
      { month: 'Feb', deliveries: 5, errors: 0, budget: 40000, spent: 40000, errorSolutionTime: 0 },
      { month: 'Mar', deliveries: 5, errors: 1, budget: 40000, spent: 41000, errorSolutionTime: 2 },
      { month: 'Apr', deliveries: 5, errors: 0, budget: 40000, spent: 39000, errorSolutionTime: 0 },
      { month: 'May', deliveries: 4, errors: 0, budget: 40000, spent: 40000, errorSolutionTime: 0 },
      { month: 'Jun', deliveries: 1, errors: 0, budget: 10000, spent: 10000, errorSolutionTime: 0 },
    ],
  },
  {
    id: 'PRJ-004',
    name: 'Internal CRM System',
    description: 'New CRM system for the sales and marketing teams.',
    stage: 'Definición',
    riskLevel: 'Moderado',
    riskScore: 9,
    budget: 750000,
    budgetSpent: 50000,
    projectedDeliveries: 15,
    startDate: '2024-06-01',
    endDate: '2025-06-30',
    owner: { name: 'Luis Martinez', avatar: '/avatars/04.png' },
    metrics: [
        { month: 'Jun', deliveries: 0, errors: 0, budget: 50000, spent: 50000, errorSolutionTime: 0 },
    ],
  },
  {
    id: 'PRJ-005',
    name: 'Data Warehouse Migration',
    description: 'Migrating legacy data warehouse to a cloud-based solution.',
    stage: 'Cerrado',
    riskLevel: 'Conservador',
    riskScore: 5,
    budget: 400000,
    budgetSpent: 390000,
    projectedDeliveries: 8,
    startDate: '2023-05-01',
    endDate: '2024-02-28',
    owner: { name: 'Elena Petrova', avatar: '/avatars/05.png' },
    metrics: [
        { month: 'Jan', deliveries: 4, errors: 0, budget: 50000, spent: 50000, errorSolutionTime: 0 },
        { month: 'Feb', deliveries: 4, errors: 0, budget: 40000, spent: 40000, errorSolutionTime: 0 },
    ],
  },
  {
    id: 'PRJ-006',
    name: 'Cybersecurity Audit Tool',
    description: 'A tool for internal teams to perform regular security audits.',
    stage: 'Ambiente DEV',
    riskLevel: 'Moderado - alto',
    riskScore: 12,
    budget: 250000,
    budgetSpent: 110000,
    projectedDeliveries: 12,
    startDate: '2024-03-01',
    endDate: '2024-10-31',
    owner: { name: 'Javier Nuñez', avatar: '/avatars/06.png' },
    metrics: [
      { month: 'Mar', deliveries: 2, errors: 1, budget: 30000, spent: 28000, errorSolutionTime: 4 },
      { month: 'Apr', deliveries: 2, errors: 0, budget: 30000, spent: 30000, errorSolutionTime: 0 },
      { month: 'May', deliveries: 1, errors: 1, budget: 30000, spent: 32000, errorSolutionTime: 5 },
      { month: 'Jun', deliveries: 1, errors: 0, budget: 30000, spent: 20000, errorSolutionTime: 0 },
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

// Mock data for users - in a real app, this would come from your auth provider or database
export const MOCK_USERS: User[] = [
    { id: 'USR-001', name: 'Ana Rodriguez', email: 'ana.rodriguez@example.com', role: 'PM/SM', avatar: '/avatars/01.png' },
    { id: 'USR-002', name: 'Carlos Gomez', email: 'carlos.gomez@example.com', role: 'PM/SM', avatar: '/avatars/02.png' },
    { id: 'USR-004', name: 'Luis Martinez', email: 'luis.martinez@example.com', role: 'Admin', avatar: '/avatars/04.png' },
    { id: 'USR-005', name: 'Elena Petrova', email: 'elena.petrova@example.com', role: 'Viewer', avatar: '/avatars/05.png' },
    { id: 'USR-007', name: 'Laura Torres', email: 'laura.torres@example.com', role: 'Portfolio Manager', avatar: '/avatars/07.png' },
];


export function getProjects(): Project[] {
  // Return a copy to avoid mutation of the original array
  return JSON.parse(JSON.stringify(MOCK_PROJECTS));
}

export function addProject(project: Project) {
    MOCK_PROJECTS.push(project);
}


export function getProjectById(id: string): Project | undefined {
    const project = MOCK_PROJECTS.find(p => p.id === id);
    return project ? JSON.parse(JSON.stringify(project)) : undefined;
}

export function getProjectsByStage(stage: ProjectStage): Project[] {
    return MOCK_PROJECTS.filter(p => p.stage === stage);
}


export function getDeliveries(): Delivery[] {
  return JSON.parse(JSON.stringify(MOCK_DELIVERIES));
}

export function getDeliveriesByProjectId(projectId: string): Delivery[] {
    return MOCK_DELIVERIES.filter(d => d.projectId === projectId);
}

export function getDeliveryById(id: string): Delivery | undefined {
    const delivery = MOCK_DELIVERIES.find(d => d.id === id);
    if (!delivery) return undefined;
    // Ensure budget history is an array
    if (!delivery.budgetHistory) {
        delivery.budgetHistory = [];
    }
    return JSON.parse(JSON.stringify(delivery));
}


export function addDelivery(delivery: Delivery) {
    MOCK_DELIVERIES.push(delivery);
}

export function getDashboardKpis(projects: Project[]) {
    const projectsInProgress = projects.filter(p => p.stage !== 'Cerrado');
    const totalBudget = projectsInProgress.reduce((sum, p) => sum + p.budget, 0);

    const onTrackProjects = projectsInProgress.length;

    const highRiskProjects = projectsInProgress.filter(p => 
        ['Moderado - alto', 'Agresivo', 'Muy Agresivo'].includes(p.riskLevel)
    ).length;
    
    const totalDeliveries = getDeliveries().filter(d => d.stage === 'Cerrado').length;
    
    return {
        totalBudget,
        onTrackProjects,
        highRiskProjects,
        totalDeliveries,
    }
}

export const aggregateMetrics = (projects: Project[]) => {
    const monthlyData: { [key: string]: { actual: number; planned: number; errors: number; totalErrorTime: number; errorEntries: number, budget: number, spent: number, cumulativeBudget: number } } = {};
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthMap: { [key: string]: number } = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

    projects.forEach(project => {
        const startDate = parseISO(project.startDate);
        const endDate = parseISO(project.endDate);
        const startMonth = getMonth(startDate);
        const startYear = getYear(startDate);
        const totalMonths = differenceInMonths(endDate, startDate) + 1;
        const projectedDeliveries = project.projectedDeliveries || 0;
        const plannedPerMonth = totalMonths > 0 ? projectedDeliveries / totalMonths : 0;
        const budgetPerMonth = totalMonths > 0 ? project.budget / totalMonths : 0;
        
        // Initialize planned data
        for (let i = 0; i < totalMonths; i++) {
            const currentMonthIndex = (startMonth + i) % 12;
            const currentYear = startYear + Math.floor((startMonth + i) / 12);
            const monthName = monthOrder[currentMonthIndex];
            const dataKey = `${monthName}-${currentYear}`;

            if (!monthlyData[dataKey]) {
                monthlyData[dataKey] = { planned: 0, actual: 0, errors: 0, totalErrorTime: 0, errorEntries: 0, budget: 0, spent: 0, cumulativeBudget: 0 };
            }
            monthlyData[dataKey].planned += plannedPerMonth;
            monthlyData[dataKey].budget += budgetPerMonth;
        }

        // Add actual metrics
        project.metrics.forEach(metric => {
            const metricMonthIndex = monthMap[metric.month];
            let metricYear = startYear;
             if (getYear(startDate) !== getYear(endDate) && metricMonthIndex < startMonth) {
                metricYear = getYear(endDate);
            }
            
            const dataKey = `${metric.month}-${metricYear}`;
             if (!monthlyData[dataKey]) {
                monthlyData[dataKey] = { planned: 0, actual: 0, errors: 0, totalErrorTime: 0, errorEntries: 0, budget: 0, spent: 0, cumulativeBudget: 0 };
            }
            monthlyData[dataKey].actual += metric.deliveries;
            monthlyData[dataKey].errors += metric.errors;
            monthlyData[dataKey].spent += metric.spent;

            if (metric.errorSolutionTime && metric.errors > 0) {
              monthlyData[dataKey].totalErrorTime += metric.errorSolutionTime * metric.errors;
              monthlyData[dataKey].errorEntries += metric.errors;
            }
        });
    });

    const sortedKeys = Object.keys(monthlyData).sort((a, b) => {
        const [monthA, yearA] = a.split('-');
        const [monthB, yearB] = b.split('-');
        if (yearA !== yearB) {
            return Number(yearA) - Number(yearB);
        }
        return monthMap[monthA] - monthMap[monthB];
    });

    let cumulativePlanned = 0;
    let cumulativeActual = 0;
    let cumulativeSpent = 0;
    let cumulativeBudget = 0;
    
    return sortedKeys.map(key => {
        const [month, year] = key.split('-');
        cumulativePlanned += monthlyData[key].planned;
        cumulativeActual += monthlyData[key].actual;
        cumulativeSpent += monthlyData[key].spent;
        cumulativeBudget += monthlyData[key].budget;

        const avgErrorTime = monthlyData[key].errorEntries > 0 ? monthlyData[key].totalErrorTime / monthlyData[key].errorEntries : 0;
        
        return {
            name: `${month}-${year.slice(-2)}`,
            planned: Math.round(cumulativePlanned),
            actual: cumulativeActual,
            errors: monthlyData[key].errors,
            avgErrorSolutionTime: avgErrorTime,
            cumulativeBudget: Math.round(cumulativeBudget),
            spent: cumulativeSpent
        };
    });
};


export function getRiskProfile(score: number): Omit<RiskResult, 'score'> {
    if (score >= 18) return { classification: 'Muy Agresivo', deviation: '+200%' };
    if (score >= 12 && score <=17) return { classification: 'Agresivo', deviation: '+100%' };
    if (score >= 10 && score <= 11) return { classification: 'Moderado - alto', deviation: '+70%' };
    if (score >= 6 && score <= 9) return { classification: 'Moderado', deviation: '+40%' };
    if (score >= 3 && score <= 5) return { classification: 'Conservador', deviation: '+20%' };
    if (score >= 1 && score <= 2) return { classification: 'Muy conservador', deviation: '+10%' };
    return { classification: 'Muy conservador', deviation: '+10%' };
}

export function updateProjectRisk(projectId: string, score: number, level: RiskLevel, deliveryId?: string) {
    const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
        MOCK_PROJECTS[projectIndex].riskScore = score;
        MOCK_PROJECTS[projectIndex].riskLevel = level;
    }

    if (deliveryId) {
        const deliveryIndex = MOCK_DELIVERIES.findIndex(d => d.id === deliveryId);
        if (deliveryIndex !== -1) {
            MOCK_DELIVERIES[deliveryIndex].riskAssessed = true;
        }
    }
}
