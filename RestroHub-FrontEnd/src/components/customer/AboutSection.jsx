import React from 'react';
import { useSiteData } from '@context/SiteContext.jsx';

// ============================================
// ABOUT SECTION COMPONENT
// Story section with stats and image
// ============================================

const AboutSection = () => {
    const { siteData } = useSiteData();

    if (!siteData) return null;

    const { about = {} } = siteData;
    const title0 = Array.isArray(about.title)
        ? about.title[0]
        : typeof about.title === 'string'
            ? about.title.split(' ')[0]
            : 'Authentic';

    const title1 = Array.isArray(about.title)
        ? about.title[1] || ''
        : typeof about.title === 'string'
            ? about.title.split(' ').slice(1).join(' ')
            : 'Indian Cuisine';

    const descriptions = Array.isArray(about.description)
        ? about.description
        : typeof about.description === 'string'
            ? [about.description]
            : [];

    const stats = Array.isArray(about.stats) ? about.stats : [];

    return (
        <section id="about" className="about section">
            <div className="container">
                <div className="about-grid">
                    {/* Content */}
                    <div className="about-content">
                        {about.subtitle && <p className="section-subtitle">{about.subtitle}</p>}
                        <h2 className="section-title font-heading">
                            {title0}
                            {title1 && (
                                <>
                                    <br />
                                    {title1}
                                </>
                            )}
                        </h2>

                        <div className="about-description">
                            {descriptions.map((para, index) => (
                                <p key={index}>{para}</p>
                            ))}
                        </div>

                        {/* Stats */}
                        {stats.length > 0 && (
                            <div className="about-stats">
                                {stats.map((stat, index) => (
                                    <div key={index} className="about-stat">
                                        <p className="about-stat-value font-heading">{stat.value}</p>
                                        <p className="about-stat-label">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Image */}
                    <div className="about-image-wrapper">
                        <img
                            src={about.image}
                            alt="Chef preparing food"
                            className="about-image"
                        />

                        {/* Hours Badge */}
                        <div className="about-hours-badge">
                            <p className="about-hours-title font-heading">{about.hours.title}</p>
                            <p className="about-hours-time">{about.hours.time}</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .about {
                    background-color: var(--color-bg-secondary);
                }

                .about-grid {
                    display: grid;
                    gap: var(--spacing-xl);
                    align-items: center;
                }

                @media (min-width: 1024px) {
                    .about-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: var(--spacing-4xl);
                    }
                }

                .about-content {
                    order: 2;
                }

                @media (min-width: 1024px) {
                    .about-content {
                        order: 1;
                    }
                }

                .about-description {
                    margin: var(--spacing-xl) 0;
                }

                .about-description p {
                    color: var(--color-text-secondary);
                    line-height: 1.8;
                    margin-bottom: var(--spacing-lg);
                }

                .about-stats {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-xl);
                }

                @media (min-width: 768px) {
                    .about-stats {
                        gap: var(--spacing-2xl);
                    }
                }

                .about-stat-value {
                    font-size: var(--text-3xl);
                    color: var(--color-primary);
                    margin-bottom: var(--spacing-xs);
                }

                @media (min-width: 768px) {
                    .about-stat-value {
                        font-size: var(--text-4xl);
                    }
                }

                .about-stat-label {
                    font-size: var(--text-sm);
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .about-image-wrapper {
                    position: relative;
                    order: 1;
                }

                @media (min-width: 1024px) {
                    .about-image-wrapper {
                        order: 2;
                    }
                }

                .about-image {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                }

                @media (min-width: 768px) {
                    .about-image {
                        height: 500px;
                    }
                }

                @media (min-width: 1024px) {
                    .about-image {
                        height: 600px;
                    }
                }

                .about-hours-badge {
                    position: absolute;
                    bottom: -1rem;
                    left: var(--spacing-md);
                    background-color: var(--color-primary);
                    color: var(--color-button-text); /* Changed */
                    padding: var(--spacing-md) var(--spacing-lg);
                }

                @media (min-width: 768px) {
                    .about-hours-badge {
                        bottom: -2rem;
                        left: -2rem;
                        padding: var(--spacing-xl) var(--spacing-2xl);
                    }
                }

                .about-hours-title {
                    font-size: var(--text-xl);
                    font-weight: 700;
                }

                @media (min-width: 768px) {
                    .about-hours-title {
                        font-size: var(--text-2xl);
                    }
                }

                .about-hours-time {
                    font-size: var(--text-sm);
                }
            `}</style>
        </section>
    );
};

export default AboutSection;
