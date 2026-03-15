'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState({ type: null, message: null });
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            setStatus({ type: 'error', message: 'Token inválido o faltante en la URL' });
            return;
        }

        if (password.length < 6) {
            setStatus({ type: 'error', message: 'La contraseña debe tener al menos 6 caracteres' });
            return;
        }

        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Las contraseñas no coinciden' });
            return;
        }

        setIsLoading(true);
        setStatus({ type: null, message: null });
        
        try {
            const res = await fetch(`${getApiUrl()}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                setStatus({
                    type: 'success',
                    message: 'Contraseña restablecida exitosamente. Redirigiendo...'
                });
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || 'Hubo un error al restablecer la contraseña. Es posible que el token haya expirado.'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Error de conexión con el servidor.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm text-center">
                El enlace es inválido o no contiene un token de recuperación.
                <div className="mt-4">
                    <Link href="/forgot-password" className="font-medium underline hover:text-red-900">
                        Solicitar nuevo enlace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {status.message && (
                <div className={`p-3 rounded-md text-sm ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
                    {status.message}
                </div>
            )}
            
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Nueva contraseña
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E85D56] focus:border-[#E85D56] sm:text-sm"
                        placeholder="Mínimo 6 caracteres"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar nueva contraseña
                </label>
                <div className="mt-1">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E85D56] focus:border-[#E85D56] sm:text-sm"
                        placeholder="Repite tu contraseña"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading || status.type === 'success'}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a1a2e] hover:bg-[#252541] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a2e] transition-colors ${
                        (isLoading || status.type === 'success') ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
                </button>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center flex-col items-center">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">
                        Brief<span className="text-[#E85D56]">AI</span>news
                    </h1>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Crea una nueva contraseña
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Suspense fallback={<div className="text-center p-4">Cargando...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
