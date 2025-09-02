"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LoginForm } from './login-form';
import { AppLayout } from '@/components/layout/app-layout';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginForm />;
    }

    return (
        <AppLayout>
            {children}
        </AppLayout>
    );
}
