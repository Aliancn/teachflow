import { create } from 'zustand';

type AuthState = {
    user: null | {
        id: string;
        email: string;
        name: string;
        role: 'user' | 'admin';
    };
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    refreshAuth: () => Promise<void>;
    initializeFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    error: null,
    initializeFromStorage: () => {
        const storedUser = localStorage.getItem('auth_user');
        const storedToken = localStorage.getItem('auth_token');
        if (storedUser && storedToken) {
            set({ user: JSON.parse(storedUser), token: storedToken });
        }
    },
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            // TODO: 替换为实际API调用
            // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password })
            // });

            // if (!response.ok) throw new Error('登录失败');

            // const data = await response.json();
            console.log('login', email, password)
            const data = {
                user: {
                    id: '1',
                    email: email,       
                    name: 'Admin',
                    role: 'admin'
                },
                token: 'mock_token',
                refreshToken: 'mock_refresh_token'
            }
            localStorage.setItem('auth_user', JSON.stringify(data.user));
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('refresh_token', data.refreshToken);
            document.cookie = `isAuthenticated=true; path=/; expires=${new Date(Date.now() + 3600 * 1000).toUTCString()}`;
            set({
                user: { ...data.user, role: data.user.role === 'admin' ? 'admin' : 'user' },
                token: data.token,
                refreshToken: data.refreshToken,
                isLoading: false,
            });
        } catch (error) {
            set({ error: '登录失败，请检查凭证'+ error, isLoading: false });
        }
    },
    logout: () => {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        document.cookie = 'isAuthenticated=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        set({ user: null, token: null, refreshToken: null});
    },
    register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '注册失败');
            }

            const data = await response.json();
            localStorage.setItem('auth_user', JSON.stringify(data.user));
            localStorage.setItem('auth_token', data.token);
            set({
                user: { ...data.user, role: 'user' },
                token: data.token,
                isLoading: false
            });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : '注册失败', isLoading: false });
        }
    },
    refreshAuth: async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`
                }
            });

            if (!response.ok) throw new Error('Token刷新失败');

            const data = await response.json();
            localStorage.setItem('auth_token', data.token);
            set({ token: data.token });
        } catch (error) {
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token');
            set({ user: null, token: null });
        }
    }
}));