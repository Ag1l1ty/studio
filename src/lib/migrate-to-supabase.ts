import { supabaseService } from './supabase-service';
import { getUsersFromStorage, getProjects, getDeliveries, getRiskProfiles } from './data';
import type { User, Project, Delivery, RiskProfile } from './types';

export interface MigrationResult {
    success: boolean;
    message: string;
    migrated: {
        users: number;
        projects: number;
        deliveries: number;
        riskProfiles: number;
    };
    error?: string;
}

export async function migrateAllDataToSupabase(): Promise<MigrationResult> {
    const errors: string[] = [];
    const details = {
        users: 0,
        projects: 0,
        deliveries: 0,
        riskProfiles: 0,
    };

    try {
        console.log('Starting migration to Supabase...');

        const localUsers = getUsersFromStorage();
        const localProjects = getProjects();
        const localDeliveries = getDeliveries();
        const localRiskProfiles = getRiskProfiles();

        console.log(`Found ${localUsers.length} users, ${localProjects.length} projects, ${localDeliveries.length} deliveries, ${localRiskProfiles.length} risk profiles`);

        for (const user of localUsers) {
            try {
                await supabaseService.addUser({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    assignedProjectIds: user.assignedProjectIds,
                    password: user.password,
                    temporaryPassword: user.temporaryPassword,
                    lastPasswordChange: user.lastPasswordChange,
                });
                details.users++;
            } catch (error) {
                const errorMsg = `Failed to migrate user ${user.email}: ${error}`;
                console.error(errorMsg);
                errors.push(errorMsg);
            }
        }

        for (const project of localProjects) {
            try {
                await supabaseService.addProject(project);
                details.projects++;
            } catch (error) {
                const errorMsg = `Failed to migrate project ${project.name}: ${error}`;
                console.error(errorMsg);
                errors.push(errorMsg);
            }
        }

        for (const delivery of localDeliveries) {
            try {
                await supabaseService.addDelivery(delivery);
                details.deliveries++;
            } catch (error) {
                const errorMsg = `Failed to migrate delivery ${delivery.id}: ${error}`;
                console.error(errorMsg);
                errors.push(errorMsg);
            }
        }

        try {
            await supabaseService.updateRiskProfiles(localRiskProfiles);
            details.riskProfiles = localRiskProfiles.length;
        } catch (error) {
            const errorMsg = `Failed to migrate risk profiles: ${error}`;
            console.error(errorMsg);
            errors.push(errorMsg);
        }

        if (errors.length === 0) {
            return {
                success: true,
                message: `Successfully migrated all data to Supabase`,
                migrated: details,
            };
        } else {
            return {
                success: false,
                message: `Migration completed with ${errors.length} errors`,
                migrated: details,
                error: errors.join('; '),
            };
        }

    } catch (error) {
        console.error('Migration failed:', error);
        return {
            success: false,
            message: `Migration failed: ${error}`,
            migrated: { users: 0, projects: 0, deliveries: 0, riskProfiles: 0 },
            error: String(error),
        };
    }
}

export async function exportDataFromSupabase(): Promise<any> {
    try {
        const users = await supabaseService.getUsers();
        const projects = await supabaseService.getProjects();
        const deliveries = await supabaseService.getDeliveries();
        const riskProfiles = await supabaseService.getRiskProfiles();
        
        return {
            users,
            projects,
            deliveries,
            riskProfiles,
            exportDate: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Export failed:', error);
        throw error;
    }
}

export async function checkSupabaseConnection(): Promise<boolean> {
    try {
        await supabaseService.getRiskProfiles();
        return true;
    } catch (error) {
        console.error('Supabase connection check failed:', error);
        return false;
    }
}
