import FeaturedCard from './FeaturedCard';
import CompactCard from './CompactCard';

/**
 * HeroSection Component
 * Main hero area: FeaturedCard (left 60%) + CompactCard list (right 40%).
 * Matches the NewsHub reference hero layout.
 * @param {Object} props
 * @param {import('../lib/utils').INews} props.featured - Main featured article
 * @param {import('../lib/utils').INews[]} props.sideArticles - Side compact articles (max 4)
 */
export default function HeroSection({ featured, sideArticles = [] }) {
    if (!featured) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Featured Card - 3 of 5 columns */}
                <div className="lg:col-span-3">
                    <FeaturedCard article={featured} />
                </div>

                {/* Compact Cards Sidebar - 2 of 5 columns */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-5">
                    {sideArticles.map((article) => (
                        <CompactCard
                            key={article.id_article || article._id}
                            article={article}

                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
