import Header from '@/components/Header';
import PortalesContent from '@/components/PortalesContent';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Portales — BriefAInews',
    description: 'Noticias destacadas agrupadas por portal de origen.',
};

/**
 * Fetch headline news grouped by portal from the backend API
 * @returns {Promise<Array<{portal: string, articles: Array}>>}
 */
async function getPortals() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
        const res = await fetch(`${baseUrl}/api/news/portals`, { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

/**
 * Portales Page — Server Component
 * Groups news by portal and renders a section per portal with a client-side filter.
 */
export default async function PortalesPage() {
    const portals = await getPortals();

    return (
        <>
            <Header />

            <main className="min-h-screen">
                {/* Page Title */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                        Portales
                    </h1>
                    <p className="text-gray-500 mt-2 text-base">
                        Noticias destacadas agrupadas por medio de comunicación.
                    </p>
                </div>

                {/* Filter + Portal Sections (client-side filtering) */}
                {portals.length > 0 ? (
                    <PortalesContent portals={portals} />
                ) : (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">
                            No se encontraron portales
                        </h2>
                        <p className="text-gray-400">
                            No hay noticias destacadas disponibles en este momento.
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}
