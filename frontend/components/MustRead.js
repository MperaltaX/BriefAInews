'use client';

import { useState } from 'react';
import { getRelativeTime, normalizeImage, FALLBACK_IMAGE } from '../lib/utils';
import CompactCard from './CompactCard';
import NewsModal from './NewsModal';

/**
 * MustRead Component
 * "Lectura Obligada" section: 1 large card (left) + 4 compact cards with thumbnails (right).
 * Clicking anywhere on the main card opens the summary modal.
 * @param {Object} props
 * @param {import('../lib/utils').INews} props.mainArticle - The main large article
 * @param {import('../lib/utils').INews[]} props.sideArticles - Side compact articles (max 4)
 */
export default function MustRead({ mainArticle, sideArticles = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!mainArticle) return null;

    const imageUrl = normalizeImage(mainArticle.image_url);
    const relativeTime = getRelativeTime(mainArticle.published_time);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Section Header */}
            <div className="section-header">
                <h2 className="section-title">Lectura Obligada</h2>
                <span className="section-link cursor-pointer">
                    Ver todo
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>

            {/* Layout: Large left + Compact right */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Main Article - Large Card */}
                <div className="lg:col-span-3">
                    <article
                        className="bg-white rounded-2xl overflow-hidden card-hover cursor-pointer h-full flex flex-col"
                        onClick={() => setIsModalOpen(true)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsModalOpen(true);
                            }
                        }}
                    >
                        {/* Image */}
                        <div className="h-64 relative overflow-hidden">
                            <img
                                src={imageUrl}
                                alt={mainArticle.title}
                                className="w-full h-full object-cover img-zoom"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = FALLBACK_IMAGE;
                                    e.target.classList.replace('object-cover', 'object-contain');
                                    e.target.style.backgroundColor = '#1a1a2e';
                                    e.target.style.padding = '1.5rem';
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Portal & Time */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-[#E85D56]/10 flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-[#E85D56] uppercase">
                                        {mainArticle.portal?.charAt(0) || 'N'}
                                    </span>
                                </div>
                                <span className="text-xs font-semibold text-gray-800">{mainArticle.portal}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-400">{relativeTime}</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg md:text-xl font-extrabold text-gray-900 leading-tight mb-3 hover:text-[#E85D56] transition-colors">
                                {mainArticle.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-3">
                                {mainArticle.excerpt}
                            </p>

                            {/* Category */}
                            <div className="flex items-center gap-2">
                                {mainArticle.category && (
                                    <span className="text-xs font-semibold text-[#E85D56]">
                                        {mainArticle.category}
                                    </span>
                                )}
                                {mainArticle.country && (
                                    <>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            {mainArticle.country}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </article>

                    {/* Summary Modal for Main Article */}
                    <NewsModal
                        article={mainArticle}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>

                {/* Side Compact Cards with Images */}
                <div className="lg:col-span-2 flex flex-col gap-0 bg-white rounded-2xl p-5">
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
