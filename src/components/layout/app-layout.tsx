
"use client";

import React from 'react';
import Image from 'next/image';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppHeader } from './header';
import { SidebarNav } from './sidebar-nav';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useAuth();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="AXA Logo" width={32} height={32} />
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-sidebar-foreground">AXA Insights</h2>
                <p className="text-xs text-sidebar-foreground/80">Portfolio Dashboard</p>
              </div>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4 flex flex-col gap-2">
           {currentUser && (
              <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                      <AvatarImage src={currentUser.avatar} alt={`${currentUser.firstName} ${currentUser.lastName}`} />
                      <AvatarFallback>{currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                      <span className="text-sm font-medium text-sidebar-foreground">{currentUser.firstName} {currentUser.lastName}</span>
                      <span className="text-xs text-sidebar-foreground/70">{currentUser.role}</span>
                  </div>
              </div>
            )}
             <Button 
                variant="ghost" 
                className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={logout}
            >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
