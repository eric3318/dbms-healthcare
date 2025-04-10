import { createContext, useCallback, useEffect, useState } from 'react';
import { LoginParams, RegisterParams, User } from '../../lib/types';
import { checkAuth } from '../../utils/data';
import { login, logout, register } from '../../utils/data';

export type AuthContextType = {
    user: User | null | undefined;
    authenticated: boolean | undefined;
    login: ((params: LoginParams) => Promise<boolean>) | null;
    logout: (() => Promise<boolean>) | null;
    register: ((params: RegisterParams) => Promise<boolean>) | null;
};

export const AuthContext = createContext<AuthContextType>({
    user: undefined,
    authenticated: undefined,
    login: null,
    logout: null,
    register: null,
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [authenticated, setAuthenticated] = useState<boolean | undefined>(undefined);

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
