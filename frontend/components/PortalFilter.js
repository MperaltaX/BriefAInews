'use client';

/**
 * PortalFilter Component
 * Renders a horizontal bar of toggleable chips for filtering portals.
 * "Todos" appears active when no individual filter is applied.
 *
 * @param {Object} props
 * @param {string[]} props.portalNames - List of all available portal names
 * @param {Set<string>} props.selected - Set of currently selected portal names
 * @param {boolean} props.noFilterActive - True when no portals are individually selected (show all)
 * @param {(name: string) => void} props.onToggle - Callback when a portal chip is toggled
 * @param {() => void} props.onSelectAll - Callback to clear filters and show all portals
 */
export default function PortalFilter({ portalNames, selected, noFilterActive, onToggle, onSelectAll }) {
    return (
        <div className="portal-filter">
            {/* "Todos" chip — active when no individual filter is applied */}
            <button
                className={`portal-filter__chip ${noFilterActive ? 'portal-filter__chip--active' : ''}`}
                onClick={onSelectAll}
                type="button"
            >
                Todos
            </button>

            {/* Individual portal chips */}
            {portalNames.map((name) => {
                const isActive = selected.has(name);
                const displayName = name.charAt(0).toUpperCase() + name.slice(1);

                return (
                    <button
                        key={name}
                        className={`portal-filter__chip ${isActive ? 'portal-filter__chip--active' : ''}`}
                        onClick={() => onToggle(name)}
                        type="button"
                    >
                        {displayName}
                    </button>
                );
            })}
        </div>
    );
}
