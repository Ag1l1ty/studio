
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MOCK_RISK_PROFILES = [
    { classification: 'Muy Agresivo', score: '>= 18', deviation: '+200%' },
    { classification: 'Agresivo', score: '12 - 17', deviation: '+100%' },
    { classification: 'Moderado - alto', score: '10 - 11', deviation: '+70%' },
    { classification: 'Moderado', score: '6 - 9', deviation: '+40%' },
    { classification: 'Conservador', score: '3 - 5', deviation: '+20%' },
    { classification: 'Muy conservador', score: '1 - 2', deviation: '+10%' },
];

export function RiskAdminForm() {
    const [profiles, setProfiles] = useState(MOCK_RISK_PROFILES);

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
                                        <Input defaultValue={profile.score} className="w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Input defaultValue={profile.deviation} className="w-32" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end mt-4">
                    <Button>Guardar Cambios</Button>
                </div>
            </CardContent>
        </Card>
    );
}
