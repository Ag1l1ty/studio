
export function hashPassword(password: string): string {
    if (!password) {
        return '';
    }
    
    let hash = 0;
    const salt = 'axa-portfolio-salt-2024';
    const combined = password + salt;
    
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
    if (!password || !hashedPassword) {
        return false;
    }
    
    const properHash = hashPassword(password);
    const legacyHash = btoa(password + 'salt');
    
    return properHash === hashedPassword || legacyHash === hashedPassword;
}

export function generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export function validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];
    
    if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}
