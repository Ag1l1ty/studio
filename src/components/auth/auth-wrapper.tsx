"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LoginForm } from './login-form';
import { AppLayout } from '@/components/layout/app-layout';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const [showLogin, setShowLogin] = React.useState(true);

    React.useEffect(() => {
        console.log('AuthWrapper - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
        if (!isLoading) {
            setShowLogin(!isAuthenticated);
        }
    }, [isAuthenticated, isLoading]);

    if (!isAuthenticated) {
        return <LoginForm />;
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
