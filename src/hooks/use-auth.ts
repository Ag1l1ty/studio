
import { useState, useEffect } from 'react';
import type { Role } from '@/lib/types';
import { MOCK_USERS } from '@/lib/data';

// This is a mock auth hook. In a real app, you'd use a real auth provider.
export function useAuth() {
    const [user, setUser] = useState({
        // Default to a user with 'Project Manager/ Scrum Master' role for checking permissions.
        // Change this ID to test with other roles.
        // 'USR-001': Project Manager/ Scrum Master (Ana Rodriguez)
        // 'USR-002': Project Manager/ Scrum Master (Carlos Gomez)
        // 'USR-004': Admin (Luis Martinez)
        // 'USR-005': Viewer (Elena Petrova)
        // 'USR-007': Portfolio Manager (Laura Torres)
        id: 'USR-001', 
    });

    const currentUser = MOCK_USERS.find(u => u.id === user.id);
    const role: Role = currentUser?.role || 'Viewer';

    const isAdmin = role === 'Admin';
    const isPortfolioManager = role === 'Portfolio Manager';
    const isManager = isAdmin || isPortfolioManager;
    const isProjectManager = role === 'Project Manager/ Scrum Master';
    const isViewer = role === 'Viewer';

    return { user, role, isAdmin, isPortfolioManager, isManager, isProjectManager, isViewer, currentUser };
}
