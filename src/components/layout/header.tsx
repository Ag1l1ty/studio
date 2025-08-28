"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

const getTitleFromPathname = (pathname: string) => {
    if (pathname === '/') return 'Executive Dashboard';
    if (pathname.startsWith('/projects')) return 'Project Details';
    const cleanPath = pathname.replace('/', '').replace(/-/g, ' ');
    return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
}

export function AppHeader() {
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
    </header>
  );
}
