/**
 * Footer Component
 * Full footer with brand description, newsletter input, link columns, and copyright.
 */
export default function Footer() {
    const currentYear = new Date().getFullYear();

    const linkColumns = [
        {
            title: 'Producto',
            links: ['Resúmenes', 'Categorías', 'Tendencias', 'API'],
        },
        {
            title: 'Compañía',
            links: ['Sobre nosotros', 'Contacto', 'Prensa', 'Blog'],
        },
        {
            title: 'Recursos',
            links: ['Ayuda', 'Newsletter', 'Eventos', 'RSS'],
        },
        {
            title: 'Social',
            links: ['Twitter', 'LinkedIn', 'GitHub'],
        },
    ];

    return (
        <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <span className="text-xl font-black tracking-tight text-white">
                            Brief<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI</span>news
                        </span>
                        <p className="text-gray-400 text-sm mt-3 leading-relaxed max-w-xs">
                            Resúmenes inteligentes que inspiran conocimiento y te mantienen informado de forma rápida.
                        </p>

                        {/* Newsletter */}
                        <div className="mt-5 flex gap-2">
                            <input
                                type="email"
                                placeholder="Tu email"
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 flex-1 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all shrink-0">
                                Suscribir
                            </button>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {linkColumns.map((column) => (
                        <div key={column.title}>
                            <h4 className="text-sm font-bold text-white mb-4">{column.title}</h4>
                            <ul className="space-y-2.5">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <span className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                                            {link}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-gray-500">
                            © {currentYear} BriefAInews. Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-5">
                            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
                                Términos de servicio
                            </span>
                            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
                                Política de privacidad
                            </span>
                            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
                                Cookies
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
