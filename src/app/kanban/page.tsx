"use client";

import { useState } from 'react';
import type { Project, RiskLevel } from '@/lib/types';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { getProjects } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ListFilter } from 'lucide-react';

const ALL_RISKS: RiskLevel[] = ['Low', 'Medium', 'High'];

export default function KanbanPage() {
    const allProjects = getProjects();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRisks, setSelectedRisks] = useState<Set<RiskLevel>>(new Set(ALL_RISKS));

    const handleRiskToggle = (risk: RiskLevel) => {
        const newRisks = new Set(selectedRisks);
        if (newRisks.has(risk)) {
            newRisks.delete(risk);
        } else {
            newRisks.add(risk);
        }
        setSelectedRisks(newRisks);
    };
    
    const filteredProjects = allProjects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRisk = selectedRisks.size === 0 || selectedRisks.has(project.riskLevel);
        return matchesSearch && matchesRisk;
    });

    return (
        <div className="flex flex-col flex-1 h-full">
            <div className="flex items-center gap-4 p-4 md:p-8 md:pb-4 pb-2 border-b">
                <div className="relative flex-1">
                    <Input
                        placeholder="Search projects..."
                        className="w-full max-w-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <ListFilter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Risk</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {ALL_RISKS.map(risk => (
                            <DropdownMenuCheckboxItem
                                key={risk}
                                checked={selectedRisks.has(risk)}
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => handleRiskToggle(risk)}
                            >
                                {risk}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-8">
                 <KanbanBoard projects={filteredProjects} />
            </div>
        </div>
    );
}
