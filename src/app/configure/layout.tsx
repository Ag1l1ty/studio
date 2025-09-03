"use client";

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';

export default function ConfigureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AXA Portfolio Insights</h2>
          <p className="text-gray-600">Cargando administración...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
