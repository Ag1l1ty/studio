
import { useState, useEffect } from 'react';
import type { Role, User } from '@/lib/types';
import { getUsers } from '@/lib/data';
import { verifyPassword } from '@/lib/password-utils';

const SESSION_STORAGE_KEY = 'axa-portfolio-session';

// This is a mock auth hook. In a real app, you'd use a real auth provider.
export function useAuth() {
    const [user, setUser] = useState<{ id: string } | null>({ id: 'USR-001' });
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setUsers(getUsers());
    }, []);

    const currentUser = users.find(u => u.id === user?.id);
    const role: Role = currentUser?.role || 'Viewer';

    const isAdmin = role === 'Admin';
    const isPortfolioManager = role === 'Portfolio Manager';
    const isManager = isAdmin || isPortfolioManager;
    const isProjectManager = role === 'PM/SM';
    const isViewer = role === 'Viewer';

    const login = (email: string, password: string): boolean => {
        const foundUser = users.find(u => u.email === email);
        
        if (foundUser) {
            if (foundUser.password && !verifyPassword(password, foundUser.password)) {
                return false;
            }
            
            if (!foundUser.password) {
                return false;
            }
            
            const userData = { id: foundUser.id };
            setUser(userData);
            if (typeof window !== 'undefined') {
                localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
                window.location.reload();
            }
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            window.location.reload();
        }
    };

    const isAuthenticated = !!user;

    return { 
        user, 
        role, 
        isAdmin, 
        isPortfolioManager, 
        isManager, 
        isProjectManager, 
        isViewer, 
        currentUser,
        isAuthenticated,
        isLoading,
        login,
        logout
    };
}
