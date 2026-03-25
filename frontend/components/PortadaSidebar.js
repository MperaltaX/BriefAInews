'use client';

import { useState } from 'react';
import Portada from './Portada';
import PortadaModal from './PortadaModal';

/**
 * PortadaSidebar Component
 * Client-side component for the sidebar that handles opening the full-view modal.
 */
export default function PortadaSidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden group">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#E85D56]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Portada del Día
            </h3>
            
            <div className="relative group/cover">
                <Portada 
                    scaled={true} 
                    onClick={handleOpenModal} 
                />
                
                {/* Overlay on hover for desktop */}
                <div 
                    onClick={handleOpenModal}
                    className="absolute inset-0 bg-black/5 opacity-0 group-hover/cover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                >
                    <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover/cover:translate-y-0 transition-transform duration-300">
                        <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                            Expandir
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 text-center">
                <button 
                    onClick={handleOpenModal}
                    className="text-sm font-bold text-[#E85D56] hover:text-[#d14a43] transition-all flex items-center gap-2 mx-auto group-hover:gap-3"
                >
                    Ver versión completa 
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            </div>

            {/* Modal */}
            <PortadaModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
            />
        </div>
    );
}
