import React from 'react';
import { useSiteData } from '@context/SiteContext.jsx';

// ============================================
// HERO SECTION COMPONENT
// Full-screen hero with background image
// ============================================

const HeroSection = () => {
    const { siteData } = useSiteData();

    if (!siteData) return null;

    const { hero, navigation } = siteData;

    const title0 = Array.isArray(hero.title)
        ? hero.title[0]
        : typeof hero.title === 'string'
            ? hero.title.split(' ')[0]
            : 'Taste The';

    const title1 = Array.isArray(hero.title)
        ? hero.title[1] || ''
        : typeof hero.title === 'string'
            ? hero.title.split(' ').slice(1).join(' ')
            : 'Difference';

    return (
        <section
            className="hero hero-bg"
            style={{
                backgroundImage: `
                linear-gradient(
                    rgba(0,0,0,0.65),
                    rgba(0,0,0,0.75)
                ),
                url('${hero.backgroundImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}')
            `}}
        >
            <div className="hero-content">
                {/* Established Tag */}
                {navigation?.established && (
                    <p className="hero-established animate-pulse">
                        {navigation.established}
                    </p>
                )}

                {/* Title */}
                <h1 className="hero-title font-heading">
                    {title0}
                    {title1 && (
                        <>
                            <br />
                            <span className="text-stroke">{title1}</span>
                        </>
                    )}
                </h1>

                {/* Tagline */}
                {navigation?.tagline && (
                    <p className="hero-tagline">
                        {navigation.tagline}
                    </p>
                )}

                {/* CTA Buttons */}
                <div className="hero-cta">
                    {hero.ctaPrimary?.label && (
                        <a href={hero.ctaPrimary.href || '#menu'} className="btn btn-primary">
                            {hero.ctaPrimary.label}
                        </a>
                    )}
                    {hero.ctaSecondary?.label && (
                        <a href={hero.ctaSecondary.href || '#reservations'} className="btn btn-outline">
                            {hero.ctaSecondary.label}
                        </a>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll animate-bounce">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>

            <style>{`
                .hero {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    padding: var(--spacing-md);
                    color: #ffffff;
                }

                .hero-content {
                    text-align: center;
                    max-width: 900px;
                }

                .hero-established {
                    color: var(--color-primary);
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    font-size: var(--text-xs);
                    margin-bottom: var(--spacing-md);
                }

                @media (min-width: 768px) {
                    .hero-established {
                        letter-spacing: 0.5em;
                        font-size: var(--text-sm);
                        margin-bottom: var(--spacing-lg);
                    }
                }

                .hero-title {
                    font-size: var(--text-4xl);
                    font-weight: 700;
                    line-height: 1.1;
                    margin-bottom: var(--spacing-md);
                    color: #ffffff;
                }

                @media (min-width: 640px) {
                    .hero-title {
                        font-size: var(--text-6xl);
                    }
                }

                @media (min-width: 768px) {
                    .hero-title {
                        font-size: var(--text-8xl);
                        margin-bottom: var(--spacing-lg);
                    }
                }

                @media (min-width: 1024px) {
                    .hero-title {
                        font-size: var(--text-9xl);
                    }
                }

                .text-stroke {
                    color: transparent;
                    -webkit-text-stroke: 2px var(--color-primary);
                }

                .hero-tagline {
                    font-size: var(--text-base);
                    font-weight: 300;
                    color: rgba(255,255,255,0.9);
                    max-width: 600px;
                    margin: 0 auto var(--spacing-xl);
                    line-height: 1.8;
                }

                @media (min-width: 768px) {
                    .hero-tagline {
                        font-size: var(--text-xl);
                        margin-bottom: var(--spacing-2xl);
                    }
                }

                .hero-cta {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                    justify-content: center;
                }

                @media (min-width: 640px) {
                    .hero-cta {
                        flex-direction: row;
                    }
                }

                .hero-cta .btn {
                    padding: var(--spacing-md) var(--spacing-xl);
                }

                @media (min-width: 768px) {
                    .hero-cta .btn {
                        padding: var(--spacing-lg) var(--spacing-2xl);
                    }
                }

                .hero-scroll {
                    position: absolute;
                    bottom: var(--spacing-2xl);
                    left: 50%;
                    transform: translateX(-50%);
                    color: #ffffff;
                    display: none;
                }

                @media (min-width: 768px) {
                    .hero-scroll {
                        display: block;
                    }
                }

                .hero-scroll svg {
                    stroke: var(--color-primary);
                }
            `}</style>
        </section>
    );
};

export default HeroSection;
