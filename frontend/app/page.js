import Header from '@/components/Header';
import NewsTicker from '@/components/NewsTicker';
import HeroSection from '@/components/HeroSection';
import LatestNews from '@/components/LatestNews';
import MustRead from '@/components/MustRead';
import OtrasNoticias from '@/components/OtrasNoticias';
import Footer from '@/components/Footer';
import DailyAudioPlayer from '@/components/DailyAudioPlayer';
import PortadaSidebar from '@/components/PortadaSidebar';

export const dynamic = 'force-dynamic';

/**
 * Fetch news from the backend API
 * @param {string} country
 * @returns {Promise<Array>}
 */
async function getNews(country) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    let url = `${baseUrl}/api/news`;

    if (country && country !== 'Mundo') {
        url += `?country=${encodeURIComponent(country)}`;
    }

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

/**
 * Main Home Page Server Component
 */
export default async function Home({ searchParams }) {
    const resolvedParams = await Promise.resolve(searchParams);
    const currentCountry = resolvedParams?.country || 'Mundo';

    const news = await getNews(currentCountry);

    /* ── Distribute news into sections ── */
    const tickerHeadlines = news.slice(0, 5);
    const heroFeatured = news[0] || null;
    const heroSideArticles = news.slice(1, 5);
    const latestNewsArticles = news.slice(5, 8);
    const mustReadMain = news[8] || null;
    const mustReadSide = news.slice(9, 13);
    const weeklyHighlights = news.slice(13);

    /* ── Empty state ── */
    if (!news || news.length === 0) {
        return (
            <>
                <Header />
                <main className="min-h-screen flex flex-col items-center justify-center p-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">No se encontraron noticias</h2>
                        <p className="text-gray-400">Intenta seleccionar otra categoría o país.</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            {/* ── Header ── */}
            <Header />

            {/* ── News Ticker ── */}
            <NewsTicker headlines={tickerHeadlines} />

            <main className="relative pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 lg:mt-6 relative z-10">
                    <DailyAudioPlayer />
                </div>

                <div className="relative z-10">
                    {/* ── Hero Section ── */}
                    <HeroSection
                        featured={heroFeatured}
                        sideArticles={heroSideArticles}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* ── Main Content Area ── */}
                        <div className="lg:col-span-8 flex flex-col gap-4">
                            {latestNewsArticles.length > 0 && (
                                <div className="-mx-4 sm:mx-0">
                                    <LatestNews articles={latestNewsArticles} />
                                </div>
                            )}

                            {mustReadMain && (
                                <div className="-mx-4 sm:mx-0">
                                    <MustRead
                                        mainArticle={mustReadMain}
                                        sideArticles={mustReadSide}
                                    />
                                </div>
                            )}

                            {weeklyHighlights.length > 0 && (
                                <div className="-mx-4 sm:mx-0">
                                    <OtrasNoticias articles={weeklyHighlights} />
                                </div>
                            )}
                        </div>

                        {/* ── Right Sidebar ── */}
                        <aside className="lg:col-span-4 space-y-8 lg:pt-8 w-full max-w-sm mx-auto lg:max-w-none">
                            {/* Portada Preview & Modal */}
                            <PortadaSidebar />

                            {/* Trending Section */}
                            <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Tendencias Tech
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {['Inteligencia Artificial', 'Tecnología', 'Innovación', 'Startups', 'Machine Learning', 'Ciberseguridad'].map(tag => (
                                        <span key={tag} className="px-3.5 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-full border border-gray-200 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors shadow-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter Glassmorphism */}
                            <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-2xl p-7 flex flex-col items-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-white">
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-[40px] opacity-40 mix-blend-multiply"></div>
                                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full blur-[40px] opacity-30 mix-blend-multiply"></div>

                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 relative z-10 shadow-lg shadow-blue-500/30">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-extrabold text-gray-900 mb-2 relative z-10">Únete a la Revolución</h3>
                                <p className="text-sm text-gray-600 mb-6 relative z-10 font-medium">Insights diarios sobre IA, tecnología y el futuro. Directo en tu inbox.</p>

                                <div className="w-full flex flex-col gap-3 relative z-10">
                                    <input
                                        type="email"
                                        placeholder="Tu correo electrónico"
                                        className="w-full px-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium placeholder-gray-400 shadow-sm transition-shadow"
                                    />
                                    <button
                                        type="button"
                                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-[0_4px_14px_rgba(0,114,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,114,255,0.4)] hover:-translate-y-0.5 transition-all text-center"
                                    >
                                        Suscribirme Gratis
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* ── Footer ── */}
            <Footer />
        </>
    );
}
