import StandardCard from './StandardCard';

/**
 * LatestNews Component
 * "Últimas Noticias" section: section header + 3 equal cards in a row.
 * @param {Object} props
 * @param {import('../lib/utils').INews[]} props.articles - 3 articles to display
 */
export default function LatestNews({ articles = [] }) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Section Header */}
            <div className="section-header">
                <h2 className="section-title">Últimas Noticias</h2>
                <span className="section-link cursor-pointer">
                    Ver todo
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, 3).map((article) => (
                    <StandardCard key={article.id_article || article._id} article={article} />
                ))}
            </div>
        </section>
    );
}
