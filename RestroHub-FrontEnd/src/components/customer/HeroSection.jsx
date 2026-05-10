import React from 'react';
import { useSiteData } from '@context/SiteContext.jsx';

// ============================================
// HERO SECTION COMPONENT
// Full-screen hero with background image
// ============================================

const HeroSection = () => {
    const { siteData } = useSiteData();

    if (!siteData) return null;

    const { hero, brand } = siteData;

    return (
        <section 
            className="hero hero-bg"
            style={{
                backgroundImage: `linear-gradient(var(--color-overlay-dark), var(--color-overlay-darker)), url('${hero.backgroundImage}')`
            }}
        >
            <div className="hero-content">
                {/* Established Tag */}
                <p className="hero-established animate-pulse">
                    {brand.established}
                </p>

                {/* Title */}
                <h1 className="hero-title font-heading">
                    {hero.title[0]}
                    <br />
                    <span className="text-stroke">{hero.title[1]}</span>
                </h1>

                {/* Tagline */}
                <p className="hero-tagline">
                    {brand.tagline}
                </p>

                {/* CTA Buttons */}
                <div className="hero-cta">
                    <a href={hero.ctaPrimary.href} className="btn btn-primary">
                        {hero.ctaPrimary.label}
                    </a>
                    <a href={hero.ctaSecondary.href} className="btn btn-outline">
                        {hero.ctaSecondary.label}
                    </a>
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

                .hero-tagline {
                    font-size: var(--text-base);
                    font-weight: 300;
                    color: var(--color-text-secondary);
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
                    color: var(--color-text-primary);
                    display: none;
                }

                @media (min-width: 768px) {
                    .hero-scroll {
                        display: block;
                    }
                }
            `}</style>
        </section>
    );
};

export default HeroSection;
