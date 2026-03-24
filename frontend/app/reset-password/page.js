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
                <div className={`p-3 rounded-xl text-sm backdrop-blur-sm border flex items-center gap-2 ${
                    status.type === 'success' 
                    ? 'bg-green-50/50 text-green-800 border-green-100' 
                    : 'bg-red-50/50 text-red-700 border-red-100'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {status.message}
                </div>
            )}
            
            <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
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
                        className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/20 focus:border-[#00C6FF] transition-all bg-gray-50/50 focus:bg-white sm:text-sm"
                        placeholder="Mínimo 6 caracteres"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
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
                        className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/20 focus:border-[#00C6FF] transition-all bg-gray-50/50 focus:bg-white sm:text-sm"
                        placeholder="Repite tu contraseña"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading || status.type === 'success'}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-gradient-to-r from-[#00C6FF] to-[#0052ff] hover:from-[#00b4e6] hover:to-[#0047e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C6FF] transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                        (isLoading || status.type === 'success') ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        </div>
                    ) : 'Guardar nueva contraseña'}
                </button>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements for AI aesthetic */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-white" />
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px] -z-10" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-50/50 blur-[120px] -z-10" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/" className="flex justify-center flex-col items-center group">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 transition-transform duration-300 group-hover:scale-105">
                        Brief<span className="bg-gradient-to-r from-[#00C6FF] to-[#8A2BE2] bg-clip-text text-transparent">AI</span>news
                    </h1>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                    Crea una nueva contraseña
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-blue-500/5 sm:rounded-2xl sm:px-10 border border-white/20">
                    <Suspense fallback={<div className="text-center p-4">Cargando...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
