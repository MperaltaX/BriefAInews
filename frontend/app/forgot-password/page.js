'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: null, message: null });
    const [isLoading, setIsLoading] = useState(false);
    
    const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: null, message: null });
        
        try {
            const res = await fetch(`${getApiUrl()}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                setStatus({
                    type: 'success',
                    message: 'Si el correo existe en nuestra base de datos, recibirás un enlace para restablecer tu contraseña.'
                });
                setEmail('');
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || 'Hubo un error al procesar tu solicitud.'
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center flex-col items-center">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">
                        Brief<span className="text-[#E85D56]">AI</span>news
                    </h1>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Recuperar contraseña
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ingresa tu correo y te enviaremos un enlace para restablecerla.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {status.message && (
                            <div className={`p-3 rounded-md text-sm ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
                                {status.message}
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E85D56] focus:border-[#E85D56] sm:text-sm"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a1a2e] hover:bg-[#252541] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a2e] transition-colors ${
                                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? 'Enviando...' : 'Enviar enlace'}
                            </button>
                        </div>
                        
                        <div className="text-center mt-4">
                            <Link href="/login" className="font-medium text-sm text-[#E85D56] hover:text-[#d44d47] transition-colors">
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
