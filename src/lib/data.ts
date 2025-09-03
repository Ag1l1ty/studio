

import type { Project, ProjectStage, Delivery, RiskLevel, RiskResult, Role, User, RiskProfile } from './types';
import { subDays, addDays, getMonth, getYear, differenceInMonths, startOfMonth, parseISO, format } from 'date-fns';
import { hashPassword } from './password-utils';
import { supabaseService } from './supabase-service';

let MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-001',
    name: 'AXA Portfolio Insights Platform',
    description: 'Sistema de gestión y monitoreo de portafolio de proyectos para AXA.',
    stage: 'Soporte Productivo',
    riskLevel: 'Moderado',
    riskScore: 8,
    budget: 850000,
    budgetSpent: 720000,
    projectedDeliveries: 12,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    owner: { id: 'USR-001', name: 'Jose Andres Sanchez', avatar: '/avatars/01.png' },
    metrics: [
      { month: 'Jan', deliveries: 1, errors: 0, budget: 70000, spent: 65000, errorSolutionTime: 0 },
      { month: 'Feb', deliveries: 1, errors: 1, budget: 70000, spent: 72000, errorSolutionTime: 2 },
      { month: 'Mar', deliveries: 1, errors: 0, budget: 70000, spent: 68000, errorSolutionTime: 0 },
      { month: 'Apr', deliveries: 1, errors: 0, budget: 70000, spent: 70000, errorSolutionTime: 0 },
      { month: 'May', deliveries: 1, errors: 1, budget: 70000, spent: 75000, errorSolutionTime: 3 },
      { month: 'Jun', deliveries: 1, errors: 0, budget: 70000, spent: 69000, errorSolutionTime: 0 },
      { month: 'Jul', deliveries: 1, errors: 0, budget: 70000, spent: 71000, errorSolutionTime: 0 },
      { month: 'Aug', deliveries: 1, errors: 0, budget: 70000, spent: 70000, errorSolutionTime: 0 },
    ],
  },
];

const today = new Date();
let MOCK_DELIVERIES: Delivery[] = [
    { 
        id: 'DLV-001', 
        projectId: 'PRJ-001', 
        projectName: 'AXA Portfolio Insights Platform', 
        deliveryNumber: 9, 
        stage: 'Soporte Productivo', 
        budget: 85000, 
        budgetSpent: 82000, 
        creationDate: subDays(today, 45).toISOString(), 
        estimatedDate: '2024-09-15', 
        lastBudgetUpdate: subDays(today, 5).toISOString(), 
        owner: { id: 'USR-001', name: 'Jose Andres Sanchez', avatar: '/avatars/01.png' },
        budgetHistory: [
            { date: subDays(today, 30).toISOString(), amount: 40000 },
            { date: subDays(today, 15).toISOString(), amount: 70000 },
            { date: subDays(today, 5).toISOString(), amount: 82000 },
        ],
        stageDates: {
            'Definición': subDays(today, 240).toISOString(),
            'Desarrollo Local': subDays(today, 180).toISOString(),
            'Ambiente DEV': subDays(today, 120).toISOString(),
            'Ambiente TST': subDays(today, 60).toISOString(),
            'Soporte Productivo': subDays(today, 30).toISOString(),
        },
        riskAssessed: true
    },
];

// Mock data for users - in a real app, this would come from your auth provider or database
const DEFAULT_USERS: User[] = [
    {
        id: 'USR-001',
        firstName: 'Jose Andres',
        lastName: 'Sanchez',
        email: 'joseandres.sanchez@agilitychanges.com',
        role: 'Admin',
        avatar: '/avatars/01.png',
        assignedProjectIds: ['PRJ-001'],
        password: 'l60tth',
        temporaryPassword: false,
        lastPasswordChange: new Date().toISOString(),
    },
    {
        id: 'USR-002',
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'maria.rodriguez@test.com',
        role: 'PM/SM',
        avatar: '/avatars/02.png',
        assignedProjectIds: ['PRJ-001'],
        password: 'dGVzdHBhc3MxMjNzYWx0',
        temporaryPassword: false,
        lastPasswordChange: new Date().toISOString(),
    },
    {
        id: 'USR-003',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        email: 'carlos.rodriguez@test.com',
        role: 'Viewer',
        avatar: '/avatars/03.png',
        assignedProjectIds: [],
        password: 'cGFzc3dvcmQxMjNzYWx0',
        temporaryPassword: false,
        lastPasswordChange: new Date().toISOString(),
    },
];

const USERS_STORAGE_KEY = 'axa-portfolio-users';

export function getUsersFromStorage(): User[] {
    if (typeof window === 'undefined') {
        return DEFAULT_USERS;
    }
    
    try {
        const stored = localStorage.getItem(USERS_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        } else {
            saveUsersToStorage(DEFAULT_USERS);
            return DEFAULT_USERS;
        }
    } catch (error) {
        console.warn('Failed to load users from localStorage:', error);
        try {
            saveUsersToStorage(DEFAULT_USERS);
        } catch (saveError) {
            console.warn('Failed to save default users to localStorage:', saveError);
        }
        return DEFAULT_USERS;
    }
}

export function saveUsersToStorage(users: User[]): void {
    if (typeof window === 'undefined') {
        return;
    }
    
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
        console.warn('Failed to save users to localStorage:', error);
    }
}

export let MOCK_USERS: User[] = getUsersFromStorage();

export function getUsers(): User[] {
    return JSON.parse(JSON.stringify(getUsersFromStorage()));
}

async function getSupabaseUsers(): Promise<User[]> {
    try {
        return await supabaseService.getUsers();
    } catch (error) {
        console.warn('Failed to fetch users from Supabase, falling back to localStorage:', error);
        return getUsersFromStorage();
    }
}

export function addUser(user: Omit<User, 'id'>): User {
    console.log('addUser called with:', user);
    const newUser: User = {
        ...user,
        id: `USR-${String(Date.now()).slice(-3)}`,
        password: user.password ? hashPassword(user.password) : undefined,
        lastPasswordChange: new Date().toISOString(),
    };
    console.log('Created newUser:', newUser);
    
    supabaseService.addUser(user).then((supabaseUser: User) => {
        console.log('User added to Supabase:', supabaseUser);
    }).catch((error: any) => {
        console.warn('Failed to add user to Supabase, using localStorage only:', error);
    });
    
    const users = getUsersFromStorage();
    console.log('Current users before adding:', users.length);
    users.push(newUser);
    console.log('Users after adding:', users.length);
    saveUsersToStorage(users);
    console.log('Saved users to localStorage');
    MOCK_USERS = users;
    return newUser;
}

export function updateUser(user: User): User {
    supabaseService.updateUser(user).then((supabaseUser: User) => {
        console.log('User updated in Supabase:', supabaseUser);
    }).catch((error: any) => {
        console.warn('Failed to update user in Supabase, using localStorage only:', error);
    });

    const users = getUsersFromStorage();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        const updatedUser = { 
            ...user,
            lastPasswordChange: user.password && user.password !== users[index].password ? new Date().toISOString() : users[index].lastPasswordChange
        };
        
        if (user.password && user.password !== users[index].password) {
            updatedUser.password = hashPassword(user.password);
        }
        
        users[index] = updatedUser;
        saveUsersToStorage(users);
        MOCK_USERS = users;
    }
    return user;
}

export function deleteUser(userId: string) {
    supabaseService.deleteUser(userId).then(() => {
        console.log('User deleted from Supabase:', userId);
    }).catch((error: any) => {
        console.warn('Failed to delete user from Supabase, using localStorage only:', error);
    });

    const users = getUsersFromStorage();
    const filteredUsers = users.filter(u => u.id !== userId);
    saveUsersToStorage(filteredUsers);
    MOCK_USERS = filteredUsers;
}



export function getProjects(): Project[] {
  // Return a copy to avoid mutation of the original array
  return JSON.parse(JSON.stringify(MOCK_PROJECTS));
}

async function getSupabaseProjects(): Promise<Project[]> {
    try {
        return await supabaseService.getProjects();
    } catch (error) {
        console.warn('Failed to fetch projects from Supabase, falling back to mock data:', error);
        return JSON.parse(JSON.stringify(MOCK_PROJECTS));
    }
}

export function addProject(project: Project) {
    supabaseService.addProject(project).then(() => {
        console.log('Project added to Supabase:', project.id);
    }).catch((error: any) => {
        console.warn('Failed to add project to Supabase, using mock data only:', error);
    });

    MOCK_PROJECTS.push(project);
}

export function updateProject(project: Project): Project {
    supabaseService.updateProject(project).then(() => {
        console.log('Project updated in Supabase:', project.id);
    }).catch((error: any) => {
        console.warn('Failed to update project in Supabase, using mock data only:', error);
    });

    const index = MOCK_PROJECTS.findIndex(p => p.id === project.id);
    if (index !== -1) {
        MOCK_PROJECTS[index] = project;
    }
    return project;
}

export function deleteProject(projectId: string) {
    supabaseService.deleteProject(projectId).then(() => {
        console.log('Project deleted from Supabase:', projectId);
    }).catch((error: any) => {
        console.warn('Failed to delete project from Supabase, using mock data only:', error);
    });

    MOCK_PROJECTS = MOCK_PROJECTS.filter(p => p.id !== projectId);
    MOCK_DELIVERIES = MOCK_DELIVERIES.filter(d => d.projectId !== projectId);
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

async function getSupabaseDeliveries(): Promise<Delivery[]> {
    try {
        return await supabaseService.getDeliveries();
    } catch (error) {
        console.warn('Failed to fetch deliveries from Supabase, falling back to mock data:', error);
        return JSON.parse(JSON.stringify(MOCK_DELIVERIES));
    }
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
    supabaseService.addDelivery(delivery).then(() => {
        console.log('Delivery added to Supabase:', delivery.id);
    }).catch((error: any) => {
        console.warn('Failed to add delivery to Supabase, using mock data only:', error);
    });

    MOCK_DELIVERIES.push(delivery);
}

export function updateDelivery(delivery: Delivery): Delivery {
    supabaseService.updateDelivery(delivery).then(() => {
        console.log('Delivery updated in Supabase:', delivery.id);
    }).catch((error: any) => {
        console.warn('Failed to update delivery in Supabase, using mock data only:', error);
    });

    const index = MOCK_DELIVERIES.findIndex(d => d.id === delivery.id);
    if (index !== -1) {
        MOCK_DELIVERIES[index] = delivery;
    }
    return delivery;
}

export function deleteDelivery(deliveryId: string) {
    supabaseService.deleteDelivery(deliveryId).then(() => {
        console.log('Delivery deleted from Supabase:', deliveryId);
    }).catch((error: any) => {
        console.warn('Failed to delete delivery from Supabase, using mock data only:', error);
    });

    MOCK_DELIVERIES = MOCK_DELIVERIES.filter(d => d.id !== deliveryId);
}


export function getDashboardKpis(projects: Project[]) {
    const projectsInProgress = projects.filter(p => p.stage !== 'Cerrado');
    const totalBudget = projectsInProgress.reduce((sum, p) => sum + p.budget, 0);

    const onTrackProjects = projectsInProgress.length;

    const highRiskProjects = projectsInProgress.filter(p => 
        ['Moderado - alto', 'Agresivo', 'Muy Agresivo'].includes(p.riskLevel)
    ).length;
    
    // Count all deliveries that have been completed (i.e., registered in metrics)
    const totalDeliveries = projects.reduce((acc, project) => {
        return acc + project.metrics.reduce((sum, metric) => sum + metric.deliveries, 0);
    }, 0);
    
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

let MOCK_RISK_PROFILES: RiskProfile[] = [
    { classification: 'Muy Agresivo', score: '>= 18', deviation: '+200%' },
    { classification: 'Agresivo', score: '12 - 17', deviation: '+100%' },
    { classification: 'Moderado - alto', score: '10 - 11', deviation: '+70%' },
    { classification: 'Moderado', score: '6 - 9', deviation: '+40%' },
    { classification: 'Conservador', score: '3 - 5', deviation: '+20%' },
    { classification: 'Muy conservador', score: '1 - 2', deviation: '+10%' },
];

export function getRiskProfiles(): RiskProfile[] {
    return JSON.parse(JSON.stringify(MOCK_RISK_PROFILES));
}

async function getSupabaseRiskProfiles(): Promise<RiskProfile[]> {
    try {
        return await supabaseService.getRiskProfiles();
    } catch (error) {
        console.warn('Failed to fetch risk profiles from Supabase, falling back to mock data:', error);
        return JSON.parse(JSON.stringify(MOCK_RISK_PROFILES));
    }
}

export function updateRiskProfiles(profiles: RiskProfile[]) {
    supabaseService.updateRiskProfiles(profiles).then(() => {
        console.log('Risk profiles updated in Supabase');
    }).catch((error: any) => {
        console.warn('Failed to update risk profiles in Supabase, using mock data only:', error);
    });

    MOCK_RISK_PROFILES = profiles;
}

const parseScoreRange = (range: string): [number, number] => {
    if (range.includes('>=')) {
        return [parseInt(range.replace('>=', '').trim(), 10), Infinity];
    }
    if (range.includes('-')) {
        const [min, max] = range.split('-').map(s => parseInt(s.trim(), 10));
        return [min, max];
    }
    return [0, 0];
}


export function getRiskProfile(score: number): Omit<RiskResult, 'score'> {
    for (const profile of MOCK_RISK_PROFILES) {
        const [min, max] = parseScoreRange(profile.score);
        if (score >= min && score <= max) {
            return { classification: profile.classification, deviation: profile.deviation };
        }
    }
    // Return the most conservative profile as a fallback
    const fallbackProfile = MOCK_RISK_PROFILES[MOCK_RISK_PROFILES.length - 1];
    return { classification: fallbackProfile.classification, deviation: fallbackProfile.deviation };
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
