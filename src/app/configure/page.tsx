"use client";

import { useEffect } from 'react';

export default function ConfigurePage() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.location.href = '/admin-interface.html';
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AXA Portfolio Insights</h2>
                <p className="text-gray-600">Redirigiendo a administración...</p>
            </div>
        </div>
    );
}
