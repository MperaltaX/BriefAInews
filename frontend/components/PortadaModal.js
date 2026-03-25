'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Portada from './Portada';
import { exportPortadaToPdf } from '@/lib/pdf-export';

/**
 * PortadaModal Component
 * Full-screen modal to visualize the newspaper cover with zoom capabilities.
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {() => void} props.onClose - Function to close the modal
 * @param {Object} props.data - Portada data to display
 */
export default function PortadaModal({ isOpen, onClose, data }) {
    const [zoom, setZoom] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const containerRef = useRef(null);
    const portadaRef = useRef(null);

    /* ── Set mounted on client ── */
    useEffect(() => {
        setMounted(true);
    }, []);

    /* ── Handle Body Scroll & Reset Zoom ── */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setZoom(1);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    /* ── Close on Escape key ── */
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    const handleZoomIn = (e) => {
        e.stopPropagation();
        setZoom(prev => Math.min(prev + 0.2, 3));
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        setZoom(prev => Math.max(prev - 0.2, 0.5));
    };

    const handleResetZoom = (e) => {
        e.stopPropagation();
        setZoom(1);
    };

    const handleDownloadPdf = async (e) => {
        e.stopPropagation();
        if (isExporting) return;
        
        setIsExporting(true);
        try {
            const result = await exportPortadaToPdf(portadaRef.current);
            if (!result.success) {
                alert('Hubo un error al generar el PDF. Por favor, intente de nuevo.');
            }
        } catch (error) {
            console.error('Download Error:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return createPortal(
        <div 
            className="fixed inset-0 z-[110] flex flex-col bg-black/90 backdrop-blur-xl animate-fade-in"
            onClick={onClose}
        >
            {/* Header / Controls */}
            <div 
                className="flex items-center justify-between p-4 bg-black/40 border-b border-white/10 z-20 backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-6">
                    <h3 className="text-white font-bold text-lg hidden md:block tracking-tight">Portada del Día</h3>
                    
                    <div className="flex items-center bg-white/5 rounded-xl p-1.5 border border-white/10 shadow-inner">
                        <button 
                            onClick={handleZoomOut}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-95"
                            title="Alejar"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                        </button>
                        
                        <div className="px-4 text-white font-mono text-sm min-w-[70px] text-center select-none font-bold">
                            {Math.round(zoom * 100)}%
                        </div>
                        
                        <button 
                            onClick={handleZoomIn}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-95"
                            title="Acercar"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        </button>
                        
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        
                        <button 
                            onClick={handleResetZoom}
                            className="px-4 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all uppercase tracking-wider font-bold"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleDownloadPdf}
                        disabled={isExporting}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                            isExporting 
                            ? 'bg-white/5 text-white/40 border-white/5 cursor-not-allowed' 
                            : 'bg-[#E85D56] text-white border-[#E85D56] hover:bg-[#d14a43] hover:shadow-lg hover:shadow-red-500/20 active:scale-95'
                        }`}
                    >
                        {isExporting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generando...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Descargar PDF
                            </>
                        )}
                    </button>

                    <div className="w-px h-8 bg-white/10 mx-1" />

                    <button 
                        onClick={onClose}
                        className="p-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/5"
                        aria-label="Cerrar modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-auto p-12 md:p-20 flex justify-center items-start custom-scrollbar cursor-zoom-out"
                onClick={onClose}
            >
                <div 
                    className="transition-transform duration-200 ease-out origin-top shadow-2xl cursor-default"
                    style={{ transform: `scale(${zoom})` }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div ref={portadaRef}>
                        <Portada data={data} noMargin />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    border: 2px solid rgba(0,0,0,0.2);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>,
        document.body
    );
}
