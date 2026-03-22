import Header from '@/components/Header';
import NewsTicker from '@/components/NewsTicker';
import HeroSection from '@/components/HeroSection';
import LatestNews from '@/components/LatestNews';
import MustRead from '@/components/MustRead';
import OtrasNoticias from '@/components/OtrasNoticias';
import Footer from '@/components/Footer';
import DailyAudioPlayer from '@/components/DailyAudioPlayer';

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

            <main>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 lg:mt-6">
                    <DailyAudioPlayer />
                </div>
                
                {/* ── Hero Section ── */}
                <HeroSection
                    featured={heroFeatured}
                    sideArticles={heroSideArticles}
                />

                {/* ── Latest News (3 cards) ── */}
                {latestNewsArticles.length > 0 && (
                    <LatestNews articles={latestNewsArticles} />
                )}

                {/* ── Must Read ── */}
                {mustReadMain && (
                    <MustRead
                        mainArticle={mustReadMain}
                        sideArticles={mustReadSide}
                    />
                )}

                {/* ── Weekly Highlights / Other News ── */}
                {weeklyHighlights.length > 0 && (
                    <OtrasNoticias articles={weeklyHighlights} />
                )}
            </main>

            {/* ── Footer ── */}
            <Footer />
        </>
    );
}
