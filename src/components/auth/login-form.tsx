"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle, Key } from 'lucide-react';
import { generateRandomPassword, hashPassword } from '@/lib/password-utils';
import { getUsers, updateUser } from '@/lib/data';
import Image from 'next/image';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState(false);
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

    const handleForgotPassword = () => {
        setForgotError('');
        setForgotSuccess(false);
        setNewPassword('');
        
        if (!forgotEmail) {
            setForgotError('Por favor ingrese su email.');
            return;
        }

        const users = getUsers();
        const user = users.find(u => u.email === forgotEmail);
        
        if (!user) {
            setForgotError('No se encontró un usuario con ese email.');
            return;
        }

        const tempPassword = generateRandomPassword();
        const hashedPassword = hashPassword(tempPassword);
        
        const updatedUser = {
            ...user,
            password: hashedPassword,
            temporaryPassword: true,
            lastPasswordChange: new Date().toISOString()
        };
        
        updateUser(updatedUser);
        setNewPassword(tempPassword);
        setForgotSuccess(true);
    };

    const handleCloseForgotPassword = () => {
        setShowForgotPassword(false);
        setForgotEmail('');
        setNewPassword('');
        setForgotError('');
        setForgotSuccess(false);
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

                        <div className="mt-4">
                            <div className="text-center">
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                    onClick={() => setShowForgotPassword(true)}
                                >
                                    ¿Olvidó su contraseña?
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    Use sus credenciales de AXA para acceder al sistema
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Forgot Password Dialog */}
                <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                Recuperar Contraseña
                            </DialogTitle>
                            <DialogDescription>
                                {forgotSuccess 
                                    ? "Se ha generado una nueva contraseña temporal"
                                    : "Ingrese su email para generar una nueva contraseña temporal"
                                }
                            </DialogDescription>
                        </DialogHeader>

                        {!forgotSuccess ? (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="forgot-email">Email</Label>
                                    <Input
                                        id="forgot-email"
                                        type="email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        placeholder="usuario@example.com"
                                    />
                                </div>

                                {forgotError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{forgotError}</AlertDescription>
                                    </Alert>
                                )}

                                <DialogFooter>
                                    <Button variant="outline" onClick={handleCloseForgotPassword}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleForgotPassword}>
                                        Generar Nueva Contraseña
                                    </Button>
                                </DialogFooter>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Alert>
                                    <Key className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="space-y-2">
                                            <p><strong>Nueva contraseña temporal:</strong></p>
                                            <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                                                {newPassword}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Guarde esta contraseña y úsela para iniciar sesión. 
                                                Se recomienda cambiarla después del primer acceso.
                                            </p>
                                        </div>
                                    </AlertDescription>
                                </Alert>

                                <DialogFooter>
                                    <Button onClick={handleCloseForgotPassword} className="w-full">
                                        Entendido
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
