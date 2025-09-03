import { supabase } from './supabase';
import type { User, Project, Delivery, RiskProfile } from './types';
import { hashPassword } from './password-utils';

const isSupabaseConfigured = () => {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && supabase !== null);
};

export const supabaseService = {
    async getUsers(): Promise<User[]> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const { data, error } = await supabase!
            .from('users')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching users from Supabase:', error);
            throw error;
        }

        return data.map(user => ({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role as any,
            avatar: user.avatar,
            assignedProjectIds: user.assigned_project_ids,
            password: user.password,
            temporaryPassword: user.temporary_password,
            lastPasswordChange: user.last_password_change,
        }));
    },

    async addUser(user: Omit<User, 'id'>): Promise<User> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const newUser = {
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar || '',
            assigned_project_ids: user.assignedProjectIds || [],
            password: user.password ? hashPassword(user.password) : '',
            temporary_password: user.temporaryPassword || false,
            last_password_change: new Date().toISOString(),
        };

        const { data, error } = await supabase!
            .from('users')
            .insert([newUser])
            .select()
            .single();

        if (error) {
            console.error('Error adding user to Supabase:', error);
            throw error;
        }

        return {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            role: data.role as any,
            avatar: data.avatar,
            assignedProjectIds: data.assigned_project_ids,
            password: data.password,
            temporaryPassword: data.temporary_password,
            lastPasswordChange: data.last_password_change,
        };
    },

    async updateUser(user: User): Promise<User> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const updateData: any = {
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            assigned_project_ids: user.assignedProjectIds || [],
            temporary_password: user.temporaryPassword || false,
        };

        if (user.password) {
            updateData.password = hashPassword(user.password);
            updateData.last_password_change = new Date().toISOString();
        }

        const { data, error } = await supabase!
            .from('users')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating user in Supabase:', error);
            throw error;
        }

        return {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            role: data.role as any,
            avatar: data.avatar,
            assignedProjectIds: data.assigned_project_ids,
            password: data.password,
            temporaryPassword: data.temporary_password,
            lastPasswordChange: data.last_password_change,
        };
    },

    async deleteUser(userId: string): Promise<void> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const { error } = await supabase!
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Error deleting user from Supabase:', error);
            throw error;
        }
    },

    async getProjects(): Promise<Project[]> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const { data, error } = await supabase!
            .from('projects')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching projects from Supabase:', error);
            throw error;
        }

        return data.map(project => ({
            id: project.id,
            name: project.name,
            description: project.description,
            stage: project.stage as any,
            riskLevel: project.risk_level as any,
            riskScore: project.risk_score,
            budget: project.budget,
            budgetSpent: project.budget_spent,
            projectedDeliveries: project.projected_deliveries,
            startDate: project.start_date,
            endDate: project.end_date,
            owner: {
                id: project.owner_id,
                name: project.owner_name,
                avatar: project.owner_avatar,
            },
            metrics: project.metrics || [],
        }));
    },

    async addProject(project: Project): Promise<void> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const newProject = {
            id: project.id,
            name: project.name,
            description: project.description,
            stage: project.stage,
            risk_level: project.riskLevel,
            risk_score: project.riskScore || 0,
            budget: project.budget,
            budget_spent: project.budgetSpent,
            projected_deliveries: project.projectedDeliveries || 0,
            start_date: project.startDate,
            end_date: project.endDate,
            owner_id: project.owner.id,
            owner_name: project.owner.name,
            owner_avatar: project.owner.avatar,
            metrics: project.metrics || [],
        };

        const { error } = await supabase!
            .from('projects')
            .insert([newProject]);

        if (error) {
            console.error('Error adding project to Supabase:', error);
            throw error;
        }
    },

    async updateProject(project: Project): Promise<Project> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const updateData = {
            name: project.name,
            description: project.description,
            stage: project.stage,
            risk_level: project.riskLevel,
            risk_score: project.riskScore || 0,
            budget: project.budget,
            budget_spent: project.budgetSpent,
            projected_deliveries: project.projectedDeliveries || 0,
            start_date: project.startDate,
            end_date: project.endDate,
            owner_id: project.owner.id,
            owner_name: project.owner.name,
            owner_avatar: project.owner.avatar,
            metrics: project.metrics || [],
        };

        const { error } = await supabase!
            .from('projects')
            .update(updateData)
            .eq('id', project.id);

        if (error) {
            console.error('Error updating project in Supabase:', error);
            throw error;
        }

        return project;
    },

    async deleteProject(projectId: string): Promise<void> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const { error } = await supabase!
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (error) {
            console.error('Error deleting project from Supabase:', error);
            throw error;
        }
    },

    async getDeliveries(): Promise<Delivery[]> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const { data, error } = await supabase!
            .from('deliveries')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching deliveries from Supabase:', error);
            throw error;
        }

        return data.map(delivery => ({
            id: delivery.id,
            projectId: delivery.project_id,
            projectName: delivery.project_name,
            deliveryNumber: delivery.delivery_number,
            stage: delivery.stage as any,
            budget: delivery.budget,
            budgetSpent: delivery.budget_spent,
            estimatedDate: delivery.estimated_date,
            creationDate: delivery.creation_date,
            lastBudgetUpdate: delivery.last_budget_update,
            owner: {
                id: delivery.owner_id,
                name: delivery.owner_name,
                avatar: delivery.owner_avatar,
            },
            isArchived: delivery.is_archived,
            riskAssessed: delivery.risk_assessed,
            errorCount: delivery.error_count,
            errorSolutionTime: delivery.error_solution_time,
            stageDates: delivery.stage_dates || {},
            budgetHistory: delivery.budget_history || [],
        }));
    },

    async addDelivery(delivery: Delivery): Promise<void> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const newDelivery = {
            id: delivery.id,
            project_id: delivery.projectId,
            project_name: delivery.projectName,
            delivery_number: delivery.deliveryNumber,
            stage: delivery.stage,
            budget: delivery.budget,
            budget_spent: delivery.budgetSpent || 0,
            estimated_date: delivery.estimatedDate,
            creation_date: delivery.creationDate,
            last_budget_update: delivery.lastBudgetUpdate,
            owner_id: delivery.owner.id,
            owner_name: delivery.owner.name,
            owner_avatar: delivery.owner.avatar,
            is_archived: delivery.isArchived || false,
            risk_assessed: delivery.riskAssessed || false,
            error_count: delivery.errorCount || 0,
            error_solution_time: delivery.errorSolutionTime || 0,
            stage_dates: delivery.stageDates || {},
            budget_history: delivery.budgetHistory || [],
        };

        const { error } = await supabase!
            .from('deliveries')
            .insert([newDelivery]);

        if (error) {
            console.error('Error adding delivery to Supabase:', error);
            throw error;
        }
    },

    async updateDelivery(delivery: Delivery): Promise<Delivery> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const updateData = {
            project_id: delivery.projectId,
            project_name: delivery.projectName,
            delivery_number: delivery.deliveryNumber,
            stage: delivery.stage,
            budget: delivery.budget,
            budget_spent: delivery.budgetSpent || 0,
            estimated_date: delivery.estimatedDate,
            creation_date: delivery.creationDate,
            last_budget_update: delivery.lastBudgetUpdate,
            owner_id: delivery.owner.id,
            owner_name: delivery.owner.name,
            owner_avatar: delivery.owner.avatar,
            is_archived: delivery.isArchived || false,
            risk_assessed: delivery.riskAssessed || false,
            error_count: delivery.errorCount || 0,
            error_solution_time: delivery.errorSolutionTime || 0,
            stage_dates: delivery.stageDates || {},
            budget_history: delivery.budgetHistory || [],
        };

        const { error } = await supabase!
            .from('deliveries')
            .update(updateData)
            .eq('id', delivery.id);

        if (error) {
            console.error('Error updating delivery in Supabase:', error);
            throw error;
        }

        return delivery;
    },

    async deleteDelivery(deliveryId: string): Promise<void> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const { error } = await supabase!
            .from('deliveries')
            .delete()
            .eq('id', deliveryId);

        if (error) {
            console.error('Error deleting delivery from Supabase:', error);
            throw error;
        }
    },

    async getRiskProfiles(): Promise<RiskProfile[]> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const { data, error } = await supabase!
            .from('risk_profiles')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching risk profiles from Supabase:', error);
            throw error;
        }

        return data.map(profile => ({
            classification: profile.classification as any,
            score: profile.score,
            deviation: profile.deviation,
        }));
    },

    async updateRiskProfiles(profiles: RiskProfile[]): Promise<void> {
        if (!isSupabaseConfigured()) {
            throw new Error('Supabase not configured');
        }

        const { error: deleteError } = await supabase!
            .from('risk_profiles')
            .delete()
            .neq('id', '');

        if (deleteError) {
            console.error('Error clearing risk profiles from Supabase:', deleteError);
            throw deleteError;
        }

        const insertData = profiles.map(profile => ({
            classification: profile.classification,
            score: profile.score,
            deviation: profile.deviation,
        }));

        const { error: insertError } = await supabase!
            .from('risk_profiles')
            .insert(insertData);

        if (insertError) {
            console.error('Error updating risk profiles in Supabase:', insertError);
            throw insertError;
        }
    },
};
