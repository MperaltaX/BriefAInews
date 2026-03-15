'use client';

import { useState } from 'react';
import PortalHeroCard from './PortalHeroCard';
import PortalListCard from './PortalListCard';
import StandardCard from './StandardCard';

const GRID_PAGE_SIZE = 8;

/**
 * PortalSection Component
 * Renders a full section for a single portal:
 * - Title with portal name
 * - 1 PortalHeroCard (lead story)
 * - Up to 5 PortalListCards (secondary headlines)
 * - Remaining articles in a StandardCard grid with "Ver más" pagination
 *
 * @param {Object} props
 * @param {string} props.portalName - Name of the portal
 * @param {Array<Object>} props.articles - Array of news articles for this portal
 */
export default function PortalSection({ portalName, articles }) {
    const [gridVisible, setGridVisible] = useState(GRID_PAGE_SIZE);

    if (!articles || articles.length === 0) return null;

    const heroArticle = articles[0];
    const listArticles = articles.slice(1, 6);
    const gridArticles = articles.slice(6);
    const visibleGridArticles = gridArticles.slice(0, gridVisible);
    const hasMoreGrid = gridVisible < gridArticles.length;

    /** Capitalize portal name for display */
    const displayName = portalName.charAt(0).toUpperCase() + portalName.slice(1);

    return (
        <section className="portal-section">
            {/* Portal Title */}
            <div className="portal-section__header">
                <div className="portal-section__title-wrapper">
                    <span className="portal-section__accent-bar" />
                    <h2 className="portal-section__title">{displayName}</h2>
                    <span className="portal-section__count">
                        {articles.length} noticias
                    </span>
                </div>
            </div>

            {/* Hero Card — Lead Story */}
            <PortalHeroCard article={heroArticle} />

            {/* List Cards — Secondary Headlines */}
            {listArticles.length > 0 && (
                <div className="portal-section__list">
                    {listArticles.map((article, i) => (
                        <PortalListCard
                            key={article.id_article || article._id}
                            article={article}
                            index={i + 1}
                        />
                    ))}
                </div>
            )}

            {/* Grid — Remaining articles */}
            {visibleGridArticles.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                        {visibleGridArticles.map((article) => (
                            <StandardCard
                                key={article.id_article || article._id}
                                article={article}
                            />
                        ))}
                    </div>

                    {hasMoreGrid && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setGridVisible((prev) => prev + GRID_PAGE_SIZE)}
                                className="px-8 py-3 bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Ver más de {displayName}
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
