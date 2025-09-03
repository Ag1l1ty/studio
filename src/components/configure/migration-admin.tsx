"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Database, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { migrateToSupabase, checkSupabaseConnection, type MigrationResult } from '@/lib/migrate-to-supabase';
import { useToast } from '@/hooks/use-toast';

export function MigrationAdmin() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isMigrating, setIsMigrating] = useState(false);
    const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
    const { toast } = useToast();

    const handleCheckConnection = async () => {
        setIsChecking(true);
        try {
            const connected = await checkSupabaseConnection();
            setIsConnected(connected);
            toast({
                title: connected ? "Conexión Exitosa" : "Conexión Fallida",
                description: connected 
                    ? "Supabase está configurado y funcionando correctamente"
                    : "No se pudo conectar a Supabase. Verifica la configuración.",
                variant: connected ? "default" : "destructive",
            });
        } catch (error) {
            setIsConnected(false);
            toast({
                title: "Error de Conexión",
                description: `Error al verificar conexión: ${error}`,
                variant: "destructive",
            });
        } finally {
            setIsChecking(false);
        }
    };

    const handleMigration = async () => {
        setIsMigrating(true);
        setMigrationResult(null);
        
        try {
            const result = await migrateToSupabase();
            setMigrationResult(result);
            
            toast({
                title: result.success ? "Migración Exitosa" : "Migración con Errores",
                description: result.message,
                variant: result.success ? "default" : "destructive",
            });
        } catch (error) {
            const errorResult: MigrationResult = {
                success: false,
                message: `Error durante la migración: ${error}`,
                errors: [String(error)],
            };
            setMigrationResult(errorResult);
            
            toast({
                title: "Error de Migración",
                description: `Error durante la migración: ${error}`,
                variant: "destructive",
            });
        } finally {
            setIsMigrating(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Migración a Supabase
                    </CardTitle>
                    <CardDescription>
                        Migra todos los datos de localStorage a la base de datos Supabase PostgreSQL
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleCheckConnection}
                            disabled={isChecking}
                            variant="outline"
                        >
                            {isChecking ? "Verificando..." : "Verificar Conexión"}
                        </Button>
                        
                        {isConnected !== null && (
                            <Badge variant={isConnected ? "default" : "destructive"}>
                                {isConnected ? (
                                    <>
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Conectado
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Desconectado
                                    </>
                                )}
                            </Badge>
                        )}
                    </div>

                    {isConnected && (
                        <div className="space-y-4">
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Esta acción migrará todos los usuarios, proyectos, entregas y perfiles de riesgo 
                                    desde localStorage a Supabase. Los datos existentes en localStorage se mantendrán como respaldo.
                                </AlertDescription>
                            </Alert>

                            <Button
                                onClick={handleMigration}
                                disabled={isMigrating}
                                className="w-full"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {isMigrating ? "Migrando..." : "Iniciar Migración"}
                            </Button>
                        </div>
                    )}

                    {migrationResult && (
                        <div className="space-y-4">
                            <Alert variant={migrationResult.success ? "default" : "destructive"}>
                                {migrationResult.success ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <XCircle className="h-4 w-4" />
                                )}
                                <AlertDescription>
                                    {migrationResult.message}
                                </AlertDescription>
                            </Alert>

                            {migrationResult.details && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <div className="text-2xl font-bold text-primary">
                                            {migrationResult.details.users}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Usuarios</div>
                                    </div>
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <div className="text-2xl font-bold text-primary">
                                            {migrationResult.details.projects}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Proyectos</div>
                                    </div>
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <div className="text-2xl font-bold text-primary">
                                            {migrationResult.details.deliveries}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Entregas</div>
                                    </div>
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                        <div className="text-2xl font-bold text-primary">
                                            {migrationResult.details.riskProfiles}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Perfiles</div>
                                    </div>
                                </div>
                            )}

                            {migrationResult.errors && migrationResult.errors.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-destructive">Errores durante la migración:</h4>
                                    <div className="max-h-40 overflow-y-auto space-y-1">
                                        {migrationResult.errors.map((error, index) => (
                                            <div key={index} className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                                                {error}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
