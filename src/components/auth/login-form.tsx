"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login Debug - Form submitted with:', { email, password });
        setError('');
        setIsLoading(true);

        try {
            const success = login(email, password);
            console.log('Login Debug - Login result:', success);
            if (!success) {
                setError('Credenciales inválidas. Verifique su email y contraseña.');
            }
        } catch (err) {
            console.log('Login Debug - Login error:', err);
            setError('Error al iniciar sesión. Inténtelo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = (userEmail: string) => {
        console.log('Login Debug - Demo login clicked for:', userEmail);
        setEmail(userEmail);
        setPassword('demo');
        const success = login(userEmail, 'demo');
        console.log('Login Debug - Demo login result:', success);
        if (!success) {
            setError('Error al iniciar sesión con usuario demo.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <Image src="/logo.svg" alt="AXA Logo" width={64} height={64} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">AXA Portfolio Insights</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Inicie sesión en su cuenta para acceder al dashboard
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Iniciar Sesión</CardTitle>
                        <CardDescription>
                            Ingrese sus credenciales para acceder al sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="usuario@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={isLoading}
                            >
                                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Usuarios Demo</span>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full text-left justify-start"
                                    onClick={() => handleDemoLogin('luis.martinez@example.com')}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">Luis Martinez - Admin</span>
                                        <span className="text-xs text-gray-500">luis.martinez@example.com</span>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full text-left justify-start"
                                    onClick={() => handleDemoLogin('ana.rodriguez@example.com')}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">Ana Rodriguez - PM/SM</span>
                                        <span className="text-xs text-gray-500">ana.rodriguez@example.com</span>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full text-left justify-start"
                                    onClick={() => handleDemoLogin('elena.petrova@example.com')}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">Elena Petrova - Viewer</span>
                                        <span className="text-xs text-gray-500">elena.petrova@example.com</span>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full text-left justify-start"
                                    onClick={() => handleDemoLogin('laura.torres@example.com')}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">Laura Torres - Portfolio Manager</span>
                                        <span className="text-xs text-gray-500">laura.torres@example.com</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
