/**
 * NewsTicker Component
 * Animated scrolling news ticker showing latest headlines.
 * @param {Object} props
 * @param {Array<{title: string, category?: string}>} props.headlines - Headlines to display
 */
export default function NewsTicker({ headlines = [] }) {
    if (!headlines || headlines.length === 0) return null;

    const tickerItems = [...headlines, ...headlines];

    return (
        <div className="bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-10">
                    {/* Badge */}
                    <div className="shrink-0 flex items-center gap-2 pr-4 border-r border-gray-200 mr-4">
                        <span className="bg-[#E85D56] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                            Últimas
                        </span>
                    </div>

                    {/* Scrolling Content */}
                    <div className="overflow-hidden flex-1 relative">
                        <div className="ticker-animate flex items-center whitespace-nowrap">
                            {tickerItems.map((item, idx) => (
                                <span key={idx} className="inline-flex items-center">
                                    <span className="text-sm text-gray-700 font-medium">
                                        {item.title}
                                    </span>
                                    <span className="mx-4 text-[#E85D56] text-xs">◆</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
