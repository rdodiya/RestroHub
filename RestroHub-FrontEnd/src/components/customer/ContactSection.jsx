import React from 'react';
import { useSiteData } from '@context/SiteContext.jsx';

// ============================================
// CONTACT SECTION COMPONENT
// Location, hours, and contact info
// ============================================

// Icon components
const LocationIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const HoursIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const ContactSection = () => {
    const { siteData } = useSiteData();

    if (!siteData) return null;

    const { contact } = siteData;

    const contactItems = [
        { 
            key: 'location', 
            icon: <LocationIcon />,
            ...contact.location 
        },
        { 
            key: 'hours', 
            icon: <HoursIcon />,
            ...contact.hours 
        },
        { 
            key: 'contact', 
            icon: <PhoneIcon />,
            ...contact.contact 
        }
    ];

    return (
        <section id="contact" className="contact section">
            <div className="container">
                <div className="contact-grid">
                    {contactItems.map((item) => (
                        <div key={item.key} className="contact-item">
                            <div className="contact-icon">
                                {item.icon}
                            </div>
                            <h3 className="contact-title font-heading">{item.title}</h3>
                            <div className="contact-lines">
                                {item.lines.map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                            {item.key === 'location' && item.mapUrl && (
                                <a 
                                    href={item.mapUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="contact-link"
                                >
                                    Get Directions →
                                </a>
                            )}
                        </div>
                    ))}
                </div>

                {/* Map Embed (Optional) */}
                <div className="contact-map">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.0!2d-118.2340!3d34.0400!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDAyJzI0LjAiTiAxMTjCsDE0JzAyLjQiVw!5e0!3m2!1sen!2sus!4v1234567890"
                        width="100%"
                        height="300"
                        style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Restaurant Location"
                    />
                </div>
            </div>

            <style>{`
                .contact {
                    background-color: var(--color-bg-secondary);
                }

                .contact-grid {
                    display: grid;
                    gap: var(--spacing-xl);
                    text-align: center;
                }

                @media (min-width: 768px) {
                    .contact-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: var(--spacing-2xl);
                    }
                }

                .contact-item {
                    padding: var(--spacing-lg);
                }

                .contact-icon {
                    width: 56px;
                    height: 56px;
                    margin: 0 auto var(--spacing-md);
                    border: 1px solid var(--color-primary);
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (min-width: 768px) {
                    .contact-icon {
                        width: 64px;
                        height: 64px;
                        margin-bottom: var(--spacing-lg);
                    }
                }

                .contact-icon svg {
                    width: 24px;
                    height: 24px;
                    color: var(--color-primary);
                }

                .contact-title {
                    font-size: var(--text-xl);
                    margin-bottom: var(--spacing-md);
                }

                @media (min-width: 768px) {
                    .contact-title {
                        font-size: var(--text-2xl);
                    }
                }

                .contact-lines p {
                    color: var(--color-text-secondary);
                    font-size: var(--text-sm);
                    line-height: 1.8;
                }

                @media (min-width: 768px) {
                    .contact-lines p {
                        font-size: var(--text-base);
                    }
                }

                .contact-link {
                    display: inline-block;
                    margin-top: var(--spacing-md);
                    color: var(--color-primary);
                    text-decoration: none;
                    font-size: var(--text-sm);
                    transition: opacity var(--transition-normal);
                }

                .contact-link:hover {
                    opacity: 0.8;
                }

                .contact-map {
                    margin-top: var(--spacing-2xl);
                    overflow: hidden;
                }

                @media (min-width: 768px) {
                    .contact-map {
                        margin-top: var(--spacing-3xl);
                    }

                    .contact-map iframe {
                        height: 400px;
                    }
                }
            `}</style>
        </section>
    );
};

export default ContactSection;
