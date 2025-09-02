
import { useState, useEffect } from 'react';
import type { Role, User } from '@/lib/types';
import { getUsers } from '@/lib/data';

const SESSION_STORAGE_KEY = 'axa-portfolio-session';

// This is a mock auth hook. In a real app, you'd use a real auth provider.
export function useAuth() {
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const initializeAuth = async () => {
            setUsers(getUsers());
            
            if (typeof window !== 'undefined') {
                try {
                    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
                    console.log('Auth Debug - Saved session:', savedSession);
                    if (savedSession) {
                        const sessionData = JSON.parse(savedSession);
                        console.log('Auth Debug - Setting user:', sessionData);
                        setUser(sessionData);
                    } else {
                        console.log('Auth Debug - No saved session found');
                    }
                } catch (error) {
                    console.warn('Failed to load session from localStorage:', error);
                }
            }
            
            setTimeout(() => {
                console.log('Auth Debug - Setting isLoading to false');
                setIsLoading(false);
            }, 100);
        };
        
        initializeAuth();
    }, []);

    const currentUser = users.find(u => u.id === user?.id);
    const role: Role = currentUser?.role || 'Viewer';

    const isAdmin = role === 'Admin';
    const isPortfolioManager = role === 'Portfolio Manager';
    const isManager = isAdmin || isPortfolioManager;
    const isProjectManager = role === 'PM/SM';
    const isViewer = role === 'Viewer';

    const login = (email: string, password: string): boolean => {
        console.log('Auth Debug - Login called with:', { email, password });
        console.log('Auth Debug - Available users:', users.map(u => ({ id: u.id, email: u.email })));
        const foundUser = users.find(u => u.email === email);
        console.log('Auth Debug - Found user:', foundUser);
        if (foundUser) {
            const userData = { id: foundUser.id };
            console.log('Auth Debug - Setting user data:', userData);
            setUser(userData);
            if (typeof window !== 'undefined') {
                localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
                console.log('Auth Debug - Session saved to localStorage');
                window.location.reload();
            }
            return true;
        }
        console.log('Auth Debug - User not found');
        return false;
    };

    const logout = () => {
        console.log('Auth Debug - Logout called');
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            console.log('Auth Debug - Session removed from localStorage');
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
