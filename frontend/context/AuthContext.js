'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

/**
 * Proveedor del contexto de Autenticación
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    useEffect(() => {
        // Verificar si hay token al cargar la app
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch(`${getApiUrl()}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const data = await res.json();
                    
                    if (res.ok && data.success) {
                        setUser(data.data);
                    } else {
                        // Token inválido o expirado
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, []);

    /**
     * @param {Object} credentials - Email and password
     * @returns {Promise<Object>} Respueta de la API
     */
    const login = async (credentials) => {
        try {
            const res = await fetch(`${getApiUrl()}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                localStorage.setItem('token', data.data.token);
                setUser(data.data.user);
                return { success: true };
            }
            return { success: false, message: data.error || data.message || 'Error de credenciales' };
        } catch (error) {
            return { success: false, message: 'Fallo al conectar con el servidor' };
        }
    };

    /**
     * @param {Object} userData - Name, email, password
     * @returns {Promise<Object>} Respueta de la API
     */
    const register = async (userData) => {
        try {
            const res = await fetch(`${getApiUrl()}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                localStorage.setItem('token', data.data.token);
                setUser(data.data.user);
                return { success: true };
            }
            return { success: false, message: data.error || data.message || 'Error en el registro' };
        } catch (error) {
            return { success: false, message: 'Fallo al conectar con el servidor' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook para consumir el contexto de autenticación
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}
