import { createContext, useCallback, useEffect, useState } from 'react';
import { LoginParams, RegisterParams, User } from '../../lib/types';
import { checkAuth } from '../../utils/data';
import { login, logout, register } from '../../utils/data';

export type AuthContextType = {
    user: User | null;
    authenticated: boolean;
    login: ((params: LoginParams) => Promise<boolean>) | null;
    logout: (() => Promise<boolean>) | null;
    register: ((params: RegisterParams) => Promise<boolean>) | null;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    authenticated: false,
    login: null,
    logout: null,
    register: null,
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        getAuth();
    }, []);

    const loginHandler = useCallback(async (params: LoginParams): Promise<boolean> => {
        const success = await login(params);
        if (success) {
            await getAuth();
        }
        return success;
    }, []);

    const logoutHandler = useCallback(async (): Promise<boolean> => {
        const success = await logout();
        if (success) {
            setUser(null);
            setAuthenticated(false);
        }
        return success;
    }, []);

    const getAuth = useCallback(async () => {
        const user = await checkAuth();
        setUser(user);
        setAuthenticated(!!user);
    }, []);

    return (
        <AuthContext.Provider value={{ user, authenticated, login: loginHandler, logout: logoutHandler, register }}>
            {children}
        </AuthContext.Provider>
    );
}
