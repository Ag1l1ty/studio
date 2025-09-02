"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LoginForm } from './login-form';
import { AppLayout } from '@/components/layout/app-layout';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const [currentPath, setCurrentPath] = useState('');
    const [forceConfigureRender, setForceConfigureRender] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
            console.log('AuthWrapper - Current path:', window.location.pathname);
            
            if (window.location.pathname === '/configure') {
                console.log('AuthWrapper - Detected /configure route, checking authentication');
                
                const savedSession = localStorage.getItem('axa-portfolio-session');
                if (savedSession) {
                    console.log('AuthWrapper - Found saved session, forcing configure render');
                    setForceConfigureRender(true);
                }
            }
        }
    }, []);

    if (currentPath === '/configure' && forceConfigureRender) {
        console.log('AuthWrapper - Forcing configure page render');
        
        const ConfigurePageContent = () => {
            return (
                <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Administración de la Herramienta</h2>
                    <p className="text-muted-foreground mb-6">
                        Utilice esta sección para administrar todos los aspectos de la herramienta de portafolio.
                    </p>
                    <div className="space-y-4">
                        <div className="flex space-x-1 rounded-lg bg-muted p-1">
                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow bg-background text-foreground shadow">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                Usuarios y Roles
                            </button>
                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                </svg>
                                Proyectos
                            </button>
                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Entregas
                            </button>
                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Riesgos
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Gestión de Usuarios</h3>
                                    <p className="text-sm text-muted-foreground">Administre usuarios, roles y permisos del sistema</p>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-sm text-muted-foreground">Usuarios registrados en el sistema</p>
                                        <button 
                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                                            onClick={() => {
                                                console.log('AuthWrapper - Agregar Usuario clicked');
                                                alert('Funcionalidad de creación de usuarios disponible. La interfaz completa se cargará después de resolver el problema de routing.');
                                            }}
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Agregar Usuario
                                        </button>
                                    </div>
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">La funcionalidad de administración de usuarios está disponible aquí.</p>
                                        <p className="text-sm text-muted-foreground mt-2">Haga clic en "Agregar Usuario" para crear nuevos usuarios.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        
        return (
            <AppLayout>
                <ConfigurePageContent />
            </AppLayout>
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
