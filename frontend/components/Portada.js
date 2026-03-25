'use client';

import React, { useEffect, useState } from 'react';

/**
 * Portada component that displays a newspaper-style front page.
 * @param {Object} props
 * @param {Object} [props.data] - Optional template data. If not provided, it will fetch the latest.
 * @param {boolean} [props.scaled=false] - Whether to scale the component to fit a smaller container (like a sidebar).
 * @returns {JSX.Element}
 */
const Portada = ({ data, scaled = false, onClick, noMargin = false }) => {
    const [templateData, setTemplateData] = useState(data || null);
    const [loading, setLoading] = useState(!data);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (data) {
            setTemplateData(data);
            setLoading(false);
            return;
        }

        const fetchTemplate = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/templates/latest/portada`);
                const result = await response.json();

                if (result.success) {
                    setTemplateData(result.data);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('Error fetching template data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [data]);

    if (loading) return <div className="p-4 text-center text-gray-500">Cargando portada...</div>;
    if (error) return <div className="p-4 text-center text-red-500 border border-red-200 rounded-xl bg-red-50">Error: {error}</div>;
    if (!templateData) return <div className="p-4 text-center text-gray-400">No hay datos disponibles</div>;

    const {
        fecha_actual,
        imagen_principal,
        titular_principal,
        noticia_inferior_1_img,
        noticia_inferior_1_seccion,
        noticia_inferior_1_titular,
        noticia_inferior_2_img,
        noticia_inferior_2_seccion,
        noticia_inferior_2_titular,
        noticia_inferior_3_img,
        noticia_inferior_3_seccion,
        noticia_inferior_3_titular
    } = templateData;

    return (
        <div 
            className={`portada-wrapper ${scaled ? 'scaled' : ''} ${onClick ? 'clickable' : ''} ${noMargin ? 'no-margin' : ''}`}
            onClick={onClick}
        >
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Oswald:wght@400;700&family=Open+Sans:wght@400;600;700&display=swap');

                .portada-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    width: 100%;
                    overflow: ${scaled ? 'hidden' : 'visible'};
                    margin-bottom: ${noMargin ? '0' : '2rem'};
                }

                .portada-wrapper.scaled {
                    height: 505px; /* Exact height when scaled (842px * 0.6) */
                }

                .portada-wrapper.clickable {
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .portada-wrapper.clickable:hover {
                    transform: translateY(-5px);
                }

                .portada-wrapper.clickable:hover .page {
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                }

                .page {
                    --red:        #C32127;
                    --blue:       #2B4281;
                    --yellow:     #F7D002;
                    --dark-gray:  #333333;
                    --light-gray: #E5E5E5;
                    --body-text:  #222222;
                    --bg-color:   #ffffff;

                    background-color: var(--bg-color);
                    width: 595px;
                    height: 842px;
                    padding: 30px;
                    position: relative;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    font-family: 'Open Sans', sans-serif;
                    transform-origin: top center;
                    transition: transform 0.3s ease;
                }

                .portada-wrapper.scaled .page {
                    transform: scale(0.6);
                    margin: 0;
                }

                .top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid var(--red);
                    border-bottom: 1px solid var(--red);
                    padding: 3px 0;
                    margin-bottom: 10px;
                    font-family: 'Oswald', sans-serif;
                    font-size: 9px;
                    font-weight: bold;
                    color: var(--dark-gray);
                    text-transform: uppercase;
                }

                .masthead {
                    text-align: center;
                    margin-bottom: 15px;
                    padding: 8px 0;
                    border: 4px double var(--red);
                }

                .masthead h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 52px;
                    margin: 0;
                    color: var(--red);
                    text-transform: uppercase;
                    font-weight: 900;
                    letter-spacing: 1px;
                    line-height: 1;
                }

                .hero {
                    position: relative;
                    margin-bottom: 20px;
                    border: 2px solid var(--red);
                    background: #000;
                    flex: 1;
                    min-height: 250px;
                    overflow: hidden;
                }

                .hero-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    filter: contrast(1.1) saturate(1.2);
                }

                .hero-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 50%, transparent 100%);
                    padding: 40px 20px 15px;
                }

                .hero-overlay h2 {
                    color: #ffffff;
                    font-family: 'Oswald', sans-serif;
                    font-size: 34px;
                    margin: 0;
                    text-transform: uppercase;
                    text-shadow: 2px 2px 5px rgba(0,0,0,0.8);
                    line-height: 1.1;
                    font-weight: 700;
                }

                .secondary-news {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    border-top: 3px solid var(--red);
                    padding-top: 15px;
                    min-height: 120px;
                }

                .news-item {
                    display: flex;
                    flex-direction: row;
                    gap: 8px;
                }

                .news-img {
                    width: 65px;
                    height: 65px;
                    background-size: cover;
                    background-position: center;
                    border: 1px solid var(--red);
                    flex-shrink: 0;
                }

                .news-content {
                    display: flex;
                    flex-direction: column;
                }

                .news-section {
                    color: var(--red);
                    font-weight: 700;
                    font-size: 9px;
                    text-transform: uppercase;
                    margin-bottom: 3px;
                    font-family: 'Oswald', sans-serif;
                }

                .news-title {
                    font-family: 'Oswald', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    margin: 0;
                    color: var(--body-text);
                    line-height: 1.15;
                }

                @media (max-width: 640px) {
                    .portada-wrapper:not(.scaled) .page {
                        transform: scale(0.6);
                        margin: -150px 0;
                    }
                }
            `}</style>

            <div className="page">
                <div className="top-bar">
                    <span>www.elnacional.com.py</span>
                    <span>{fecha_actual}</span>
                    <span>@elnacionalpy</span>
                </div>

                <div className="masthead">
                    <h1>BriefAI News</h1>
                </div>

                <div className="hero">
                    <div className="hero-bg" style={{ backgroundImage: `url('${imagen_principal}')` }}></div>
                    <div className="hero-overlay">
                        <h2>{titular_principal}</h2>
                    </div>
                </div>

                <div className="secondary-news">
                    <div className="news-item">
                        <div className="news-img" style={{ backgroundImage: `url('${noticia_inferior_1_img}')` }}></div>
                        <div className="news-content">
                            <span className="news-section">{noticia_inferior_1_seccion}</span>
                            <h3 className="news-title">{noticia_inferior_1_titular}</h3>
                        </div>
                    </div>
                    <div className="news-item">
                        <div className="news-img" style={{ backgroundImage: `url('${noticia_inferior_2_img}')` }}></div>
                        <div className="news-content">
                            <span className="news-section">{noticia_inferior_2_seccion}</span>
                            <h3 className="news-title">{noticia_inferior_2_titular}</h3>
                        </div>
                    </div>
                    <div className="news-item">
                        <div className="news-img" style={{ backgroundImage: `url('${noticia_inferior_3_img}')` }}></div>
                        <div className="news-content">
                            <span className="news-section">{noticia_inferior_3_seccion}</span>
                            <h3 className="news-title">{noticia_inferior_3_titular}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portada;
