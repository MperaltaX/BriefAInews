'use client';

import { useState } from 'react';
import StandardCard from '@/components/StandardCard';

const ITEMS_PER_PAGE = 8;

/**
 * OtrasNoticias Component
 * "Destacados de la Semana" section with paginated grid.
 * @param {Object} props
 * @param {import('@/lib/utils').INews[]} props.articles - Array of news articles to display
 */
export default function OtrasNoticias({ articles }) {
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const visibleArticles = articles.slice(0, visibleCount);
    const hasMore = visibleCount < articles.length;

    /**
     * Increments the visible count by ITEMS_PER_PAGE
     */
    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Section Header */}
            <div className="section-header">
                <h2 className="section-title">Destacados de la Semana</h2>
                <span className="section-link cursor-pointer">
                    Ver todo
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>

            {/* 4-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleArticles.map((article) => (
                    <StandardCard key={article.id_article || article._id} article={article} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-10">
                    <button
                        onClick={handleLoadMore}
                        className="px-8 py-3 bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Ver más noticias
                    </button>
                </div>
            )}
        </section>
    );
}
