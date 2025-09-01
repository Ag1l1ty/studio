
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { getRiskProfiles, updateRiskProfiles } from '@/lib/data';
import type { RiskProfile } from '@/lib/types';


export function RiskAdminForm() {
    const [profiles, setProfiles] = useState(getRiskProfiles());
    const { isManager } = useAuth();
    const { toast } = useToast();

    const handleProfileChange = (index: number, field: 'score' | 'deviation', value: string) => {
        const newProfiles = [...profiles];
        newProfiles[index] = { ...newProfiles[index], [field]: value };
        setProfiles(newProfiles);
    };

    const handleSaveChanges = () => {
        updateRiskProfiles(profiles);
        toast({
            title: "Perfiles de Riesgo Guardados",
            description: "Los cambios en los perfiles de riesgo han sido guardados exitosamente.",
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Perfiles y Pesos de Riesgo</CardTitle>
                <CardDescription>
                    Ajuste los umbrales de puntuación y las desviaciones para cada perfil de riesgo.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Clasificación de Riesgo</TableHead>
                                <TableHead>Rango de Puntuación</TableHead>
                                <TableHead>Desviación Potencial</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {profiles.map((profile, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-semibold">{profile.classification}</TableCell>
                                    <TableCell>
                                        <Input 
                                            value={profile.score} 
                                            onChange={(e) => handleProfileChange(index, 'score', e.target.value)}
                                            className="w-32" 
                                            disabled={!isManager} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            value={profile.deviation} 
                                            onChange={(e) => handleProfileChange(index, 'deviation', e.target.value)}
                                            className="w-32" 
                                            disabled={!isManager} 
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end mt-4">
                    {isManager && <Button onClick={handleSaveChanges}>Guardar Cambios</Button>}
                </div>
            </CardContent>
        </Card>
    );
}
