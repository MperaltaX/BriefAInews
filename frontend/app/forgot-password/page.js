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
                    Recuperar contraseña
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ingresa tu correo y te enviaremos un enlace para restablecerla.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-blue-500/5 sm:rounded-2xl sm:px-10 border border-white/20">
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
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
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
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C6FF]/20 focus:border-[#00C6FF] transition-all bg-gray-50/50 focus:bg-white sm:text-sm"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-gradient-to-r from-[#00C6FF] to-[#0052ff] hover:from-[#00b4e6] hover:to-[#0047e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C6FF] transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Enviando...
                                    </div>
                                ) : 'Enviar enlace'}
                            </button>
                        </div>
                        
                        <div className="text-center mt-4">
                            <Link href="/login" className="font-semibold text-sm text-[#0052ff] hover:text-[#003ccc] transition-colors border-b border-transparent hover:border-[#0052ff]">
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
