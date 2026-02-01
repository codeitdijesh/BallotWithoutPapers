import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export const login = async (email: string, password: string): Promise<{ token: string }> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email,
            password
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const saveToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const logout = (): void => {
    localStorage.removeItem('token');
};