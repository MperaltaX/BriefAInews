'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

/**
 * Header Component
 *
 * Desktop (top): Dark nav bar with centered filters. Below it (outside sticky),
 * a white section with the large logo that scrolls away naturally.
 * Desktop (scrolled past logo): The inline logo fades into the dark nav bar.
 * Mobile: Logo + hamburger in dark bar, scrollable filters below (no change on scroll).
 *
 * The white logo section is intentionally OUTSIDE the sticky header to avoid
 * layout-shift feedback loops that cause flickering.
 */
export default function Header() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isPortalesPage = pathname === '/portales';
    const currentFilter = isPortalesPage ? 'Portales' : (searchParams.get('country') || 'Mundo');

    const [logoHidden, setLogoHidden] = useState(false);
    const logoSectionRef = useRef(null);

    const filters = ['Mundo', 'Argentina', 'Mexico', 'Brasil', 'Estados Unidos', 'Portales'];

    useEffect(() => {
        const logoEl = logoSectionRef.current;
        if (!logoEl) return;

        /**
         * IntersectionObserver watches the white logo section.
         * When it scrolls completely out of view → show inline logo in nav.
         * When any part is visible again → hide the inline logo.
         * This causes ZERO layout shifts because the sticky header height never changes.
         */
        const observer = new IntersectionObserver(
            ([entry]) => {
                setLogoHidden(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        observer.observe(logoEl);
        return () => observer.disconnect();
    }, []);

    /**
     * @param {string} filter - Country filter to apply
     */
    const handleFilterChange = (filter) => {
        if (filter === 'Portales') {
            router.push('/portales', { scroll: false });
            return;
        }
        const query = filter === 'Mundo' ? '' : `?country=${encodeURIComponent(filter)}`;
        router.push(`/${query}`, { scroll: false });
    };

    return (
        <>
            {/* ── Sticky Glass Navigation Bar ── */}
            <header className="sticky top-0 z-50">
                <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-14">
                            {/* Logo - Mobile (always visible) + Desktop (only when logo section hidden) */}
                            <a
                                href="/"
                                className={`flex items-center gap-1 shrink-0 transition-all duration-300 ${logoHidden
                                    ? 'md:opacity-100 md:w-auto md:mr-6'
                                    : 'md:opacity-0 md:w-0 md:mr-0 md:overflow-hidden'
                                    }`}
                            >
                                <span className="text-gray-900 text-xl font-black tracking-tight whitespace-nowrap">
                                    Brief<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">AI</span>news
                                </span>
                            </a>

                            {/* Nav Filters - Desktop */}
                            <nav className={`hidden md:flex items-center gap-1 transition-all duration-300 ${logoHidden ? 'justify-start' : 'justify-center w-full'
                                }`}>
                                {filters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => handleFilterChange(filter)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${currentFilter === filter
                                            ? 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 text-blue-700 border border-blue-500/20 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                                            }`}
                                        aria-pressed={currentFilter === filter}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </nav>

                            {/* Right Icons & Auth */}
                            <div className="flex items-center gap-3 shrink-0">
                                {/* Search Icon */}
                                <button className="text-gray-500 hover:text-blue-600 transition-colors p-1.5 hidden md:block" aria-label="Buscar">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>

                                {/* Auth Buttons (Desktop) */}
                                <div className="hidden md:flex items-center gap-3 border-l border-gray-200 pl-3 ml-1">
                                    {user ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium text-gray-500">
                                                Hola, <span className="text-gray-900 font-bold">{user.name.split(' ')[0]}</span>
                                            </span>
                                            <button
                                                onClick={logout}
                                                className="text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                Salir
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Link href="/login" className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors">
                                                Ingresar
                                            </Link>
                                            <Link href="/register" className="text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                                                Registrarse
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Hamburger - Mobile */}
                                <button className="md:hidden text-gray-500 hover:text-blue-600 transition-colors p-1.5" aria-label="Menú">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Filters - Scrollable */}
                        <div className="md:hidden overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
                            <div className="flex items-center gap-2 min-w-max">
                                {filters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => handleFilterChange(filter)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${currentFilter === filter
                                            ? 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 text-blue-700 border border-blue-500/20 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                        aria-pressed={currentFilter === filter}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Logo Below Nav - Desktop Only ──
                 OUTSIDE the sticky header so its presence/absence
                 does NOT change the sticky element's height.
                 It simply scrolls away with the page content. */}
            <div
                ref={logoSectionRef}
                className="hidden md:block bg-white border-b border-gray-100 py-5"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <a href="/" className="inline-block">
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">
                            Brief<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">AI</span>news
                        </h1>
                    </a>
                </div>
            </div>
        </>
    );
}
