/**
 * @file DailyAudioPlayer.js
 * Component to reproduce AI-generated audio summaries.
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, Volume2, Loader } from 'lucide-react';

export default function DailyAudioPlayer() {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    /**
     * Fetch daily audio URL from the backend
     * @param {boolean} force - Force regeneration
     */
    const fetchAudio = async (force = false) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/ai/daily-audio${force ? '?force=true' : ''}`);
            const data = await res.json();
            if (data.success && data.data.url) {
                // Add timestamp to query to prevent browser caching when forced
                const url = `${API_URL}${data.data.url}${force ? '?t=' + new Date().getTime() : ''}`;
                setAudioUrl(url);
                if (force) {
                    setIsPlaying(true);
                }
            }
        } catch (error) {
            console.error('Error fetching audio:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Toggle play and pause states
     */
    const togglePlay = () => {
        if (!audioUrl && !isLoading) {
            fetchAudio();
            return;
        }

        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    /**
     * Synchronize progress bar with audio time
     */
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
    };

    /**
     * Retrieve total duration of the newly loaded track
     */
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback error", e));
            }
        }
    };

    /**
     * Reset states when the audio finishes
     */
    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    /**
     * Regenerate AI audio
     */
    const handleRegenerate = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
        setProgress(0);
        fetchAudio(true);
    };

    useEffect(() => {
        if (audioUrl && audioRef.current && isPlaying) {
             audioRef.current.play().catch(e => console.error(e));
        }
    }, [audioUrl, isPlaying]);

    /**
     * Format seconds into mm:ss
     * @param {number} time
     * @returns {string} Formatted string
     */
    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto my-6 p-6 rounded-2xl bg-[#0a0f1c] border border-cyan-500/20 overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.1)] group transition-all duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-purple-900/10 z-0"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                
                {/* Play Button */}
                <button
                    onClick={togglePlay}
                    disabled={isLoading}
                    className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 flex items-center justify-center text-white hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:hover:scale-100"
                >
                    {isLoading ? (
                         <Loader className="w-8 h-8 animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="w-8 h-8 fill-current" />
                    ) : (
                        <Play className="w-8 h-8 fill-current ml-1" />
                    )}
                </button>

                {/* Content */}
                <div className="flex-1 w-full">
                    <div className="flex justify-between items-center text-sm mb-2 text-cyan-400">
                        <span className="font-semibold tracking-widest uppercase text-xs flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            AI Audio Brief
                        </span>
                        <span className="text-gray-400 font-mono">
                            {audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"} / {formatTime(duration)}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden relative group-hover:bg-gray-700 transition-colors">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-300 ease-linear"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                            <Volume2 className={`w-4 h-4 text-cyan-400 ${isPlaying ? 'animate-pulse' : ''}`} />
                            <span>Escucha el flash de noticias generado por Inteligencia Artificial</span>
                        </div>
                        <button 
                            onClick={handleRegenerate}
                            disabled={isLoading}
                            className="flex items-center gap-1 hover:text-cyan-400 text-gray-500 transition-colors"
                            title="Actualizar y Generar Nuevo Resumen"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin cursor-not-allowed text-cyan-400' : ''}`} />
                            <span className="hidden sm:inline">Regenerar</span>
                        </button>
                    </div>
                </div>
            </div>

            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                    className="hidden"
                />
            )}
        </div>
    );
}
