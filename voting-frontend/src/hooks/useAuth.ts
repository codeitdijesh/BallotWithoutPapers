import { useState, useEffect } from 'react';
import { login as apiLogin } from '../services/auth';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, [token]);

    const login = async (email: string, password: string): Promise<void> => {
        setLoading(true);
        try {
            const response = await apiLogin(email, password);
            localStorage.setItem('token', response.token);
            setToken(response.token);
            setIsAuthenticated(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        loading,
        error,
        login,
        logout,
    };
};

export default useAuth;