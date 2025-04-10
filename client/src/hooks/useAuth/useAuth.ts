import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export default function useAuth() {
    const { user, authenticated, login, logout, register } = useContext(AuthContext);

    return { user, authenticated, login, logout, register };
}
