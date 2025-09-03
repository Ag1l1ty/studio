"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LoginForm } from './login-form';
import { AppLayout } from '@/components/layout/app-layout';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (typeof window === 'undefined') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">AXA Portfolio Insights</h2>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">AXA Portfolio Insights</h2>
                    <p className="text-gray-600">Cargando...</p>
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
