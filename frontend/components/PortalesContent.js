'use client';

import { useState, useMemo } from 'react';
import PortalFilter from './PortalFilter';
import PortalSection from './PortalSection';

/**
 * PortalesContent Component
 * Client wrapper that manages portal filter state and renders
 * the filter bar + filtered PortalSection list.
 *
 * Filter behaviour:
 * - Initial state: no chips selected → all portals displayed (no filter)
 * - Click inactive chip → exclusive select (deselects all others, shows only that portal)
 * - Click active chip → deselects it (if none remain, shows all portals)
 * - "Todos" → clears selection, shows all portals
 *
 * @param {Object} props
 * @param {Array<{portal: string, articles: Array<Object>}>} props.portals - All portals data from the server
 */
export default function PortalesContent({ portals }) {
    /** Extract sorted portal names for the filter bar */
    const portalNames = useMemo(
        () => portals.map((p) => p.portal).sort(),
        [portals]
    );

    /** State: selected portals — empty means "show all" (no filter active) */
    const [selected, setSelected] = useState(() => new Set());

    /**
     * Handle click on a portal chip.
     * - If the chip is already active → deselect it
     * - If the chip is inactive → select ONLY it (exclusive selection)
     * @param {string} name - Portal name to toggle
     */
    const handleToggle = (name) => {
        setSelected((prev) => {
            if (prev.has(name)) {
                const next = new Set(prev);
                next.delete(name);
                return next;
            }
            return new Set([name]);
        });
    };

    /** "Todos" → clear all selections, show every portal */
    const handleSelectAll = () => {
        setSelected(new Set());
    };

    /** When nothing is selected, show all portals (no filter active) */
    const noFilterActive = selected.size === 0;
    const filteredPortals = noFilterActive
        ? portals
        : portals.filter((p) => selected.has(p.portal));

    return (
        <>
            {/* Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
                <PortalFilter
                    portalNames={portalNames}
                    selected={selected}
                    noFilterActive={noFilterActive}
                    onToggle={handleToggle}
                    onSelectAll={handleSelectAll}
                />
            </div>

            {/* Filtered Portal Sections */}
            {filteredPortals.length > 0 ? (
                filteredPortals.map((portalData) => (
                    <PortalSection
                        key={portalData.portal}
                        portalName={portalData.portal}
                        articles={portalData.articles}
                    />
                ))
            ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className="text-2xl font-bold text-gray-400 mb-2">
                        No hay portales seleccionados
                    </h2>
                    <p className="text-gray-400">
                        Seleccioná al menos un portal para ver sus noticias.
                    </p>
                </div>
            )}
        </>
    );
}
