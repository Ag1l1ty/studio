"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LoginForm } from './login-form';
import { AppLayout } from '@/components/layout/app-layout';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <LoginForm />;
    }

    return (
        <AppLayout>
            {children}
        </AppLayout>
    );
}
