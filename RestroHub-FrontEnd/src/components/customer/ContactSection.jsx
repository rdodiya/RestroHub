import React from 'react';
import { useSiteData } from '@context/SiteContext.jsx';

// ============================================
// CONTACT SECTION COMPONENT
// Location, hours, and contact info
// ============================================

// Icon components with enhanced styling
const LocationIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const HoursIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const ContactSection = () => {
    const { siteData } = useSiteData();

    if (!siteData) return null;

    const { contact = {} } = siteData;

    /*
     * Keep all contact section content dynamic.
     * Only icons/colors are static design elements.
     */
    const contactItems = [
        {
            key: "location",
            icon: <LocationIcon />,
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#f59e0b",
            ...(contact.location || {})
        },
        {
            key: "hours",
            icon: <HoursIcon />,
            gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            color: "#8b5cf6",
            ...(contact.hours || {})
        },
        {
            key: "contact",
            icon: <PhoneIcon />,
            gradient: "linear-gradient(135deg, #10b981, #059669)",
            color: "#10b981",
            ...(contact.contact || {})
        }
    ];

    return (
        <section id="contact" className="contact section">

            {/* ================= BACKGROUND DECORATION ================= */}

            <div className="contact-bg-decoration">
                <div className="decoration-circle decoration-circle-1"></div>
                <div className="decoration-circle decoration-circle-2"></div>
                <div className="decoration-circle decoration-circle-3"></div>
            </div>

            <div className="container">

                {/* ================= HEADER ================= */}

                <div className="contact-header">

                    <h2 className="contact-main-title font-heading">
                        {contact.sectionTitle || "Get in Touch"}
                    </h2>

                    <p className="contact-subtitle">
                        {contact.sectionSubtitle ||
                            "We'd love to hear from you. Visit us or reach out anytime."}
                    </p>

                </div>

                {/* ================= CONTACT CARDS ================= */}

                <div className="contact-grid">

                    {contactItems.map((item, index) => (

                        <div
                            key={item.key}
                            className="contact-item"
                            style={{
                                animationDelay: `${index * 0.1}s`
                            }}
                        >

                            {/* Icon */}

                            <div
                                className="contact-icon"
                                style={{
                                    "--icon-gradient": item.gradient,
                                    "--icon-color": item.color
                                }}
                            >
                                <div className="icon-glow"></div>

                                {item.icon}
                            </div>

                            {/* Dynamic Title */}

                            <h3 className="contact-title font-heading">
                                {item.title}
                            </h3>

                            {/* Dynamic Lines */}

                            <div className="contact-lines">

                                {(item.lines || []).map((line, lineIndex) => (

                                    <p key={lineIndex}>
                                        {line}
                                    </p>

                                ))}

                            </div>

                            {/* Dynamic Google Maps Link */}

                            {item.key === "location" && item.mapUrl && (

                                <a
                                    href={item.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-link"
                                >

                                    <span>
                                        Get Directions
                                    </span>

                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M3 8h10M9 4l4 4-4 4" />
                                    </svg>

                                </a>

                            )}

                        </div>

                    ))}

                </div>

                {/* ================= MAP ================= */}

                {contact.mapEmbedUrl && (

                    <div className="contact-map-wrapper">

                        {/* Map Header */}

                        <div className="map-header">

                            <div className="map-pin-icon">
                                📍
                            </div>

                            <h3 className="map-title font-heading">
                                {contact.mapTitle || "Find Us Here"}
                            </h3>

                        </div>

                        {/* Map */}

                        <div className="contact-map">

                            <iframe
                                src={contact.mapEmbedUrl}
                                width="100%"
                                height="300"
                                style={{
                                    border: 0,
                                    filter:
                                        "grayscale(100%) invert(92%) contrast(83%)"
                                }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={
                                    contact.mapTitle ||
                                    "Restaurant Location"
                                }
                            />

                            <div className="map-overlay"></div>

                        </div>

                    </div>

                )}

            </div>

            <style>{`
                .contact {
                    background-color: var(--color-bg-secondary);
                    position: relative;
                    overflow: hidden;
                }

                /* Background Decorations */
                .contact-bg-decoration {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    overflow: hidden;
                }

                .decoration-circle {
                    position: absolute;
                    border-radius: 50%;
                    background: radial-gradient(circle, var(--color-primary) 0%, transparent 70%);
                    opacity: 0.03;
                    animation: float 20s ease-in-out infinite;
                }

                .decoration-circle-1 {
                    width: 400px;
                    height: 400px;
                    top: -100px;
                    left: -100px;
                    animation-delay: 0s;
                }

                .decoration-circle-2 {
                    width: 300px;
                    height: 300px;
                    top: 50%;
                    right: -50px;
                    animation-delay: 7s;
                }

                .decoration-circle-3 {
                    width: 250px;
                    height: 250px;
                    bottom: -50px;
                    left: 30%;
                    animation-delay: 14s;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -30px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                /* Section Header */
                .contact-header {
                    text-align: center;
                    margin-bottom: var(--spacing-3xl);
                    animation: fadeInUp 0.6s ease-out;
                }

                .contact-main-title {
                    font-size: var(--text-3xl);
                    color: var(--color-text-primary);
                    margin-bottom: var(--spacing-md);
                    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                @media (min-width: 768px) {
                    .contact-main-title {
                        font-size: var(--text-4xl);
                    }
                }

                .contact-subtitle {
                    font-size: var(--text-base);
                    color: var(--color-text-secondary);
                    max-width: 600px;
                    margin: 0 auto;
                }

                @media (min-width: 768px) {
                    .contact-subtitle {
                        font-size: var(--text-lg);
                    }
                }

                /* Contact Grid */
                .contact-grid {
                    display: grid;
                    gap: var(--spacing-xl);
                    text-align: center;
                    position: relative;
                    z-index: 1;
                }

                @media (min-width: 768px) {
                    .contact-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: var(--spacing-2xl);
                    }
                }

                .contact-item {
                    padding: var(--spacing-2xl) var(--spacing-lg);
                    background: var(--color-bg-primary);
                    border-radius: var(--radius-xl);
                    border: 1px solid var(--color-border-primary);
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    animation: fadeInUp 0.6s ease-out backwards;
                    position: relative;
                    overflow: hidden;
                }

                .contact-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: var(--icon-gradient, var(--color-primary));
                    transform: scaleX(0);
                    transition: transform 0.4s ease;
                }

                .contact-item:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                    border-color: var(--icon-color);
                }

                .contact-item:hover::before {
                    transform: scaleX(1);
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Contact Icon */
                .contact-icon {
                    width: 72px;
                    height: 72px;
                    margin: 0 auto var(--spacing-lg);
                    border: 2px solid var(--color-border-primary);
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--color-bg-primary);
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                @media (min-width: 768px) {
                    .contact-icon {
                        width: 80px;
                        height: 80px;
                        margin-bottom: var(--spacing-xl);
                    }
                }

                .icon-glow {
                    position: absolute;
                    inset: -2px;
                    border-radius: inherit;
                    background: var(--icon-gradient);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    z-index: -1;
                    filter: blur(12px);
                }

                .contact-item:hover .contact-icon {
                    transform: scale(1.1) rotate(5deg);
                    border-color: var(--icon-color);
                }

                .contact-item:hover .icon-glow {
                    opacity: 0.6;
                    animation: pulse 2s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 0.3; }
                }

                .contact-icon svg {
                    width: 32px;
                    height: 32px;
                    color: var(--icon-color, var(--color-primary));
                    transition: all 0.3s ease;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
                }

                .contact-item:hover .contact-icon svg {
                    transform: scale(1.1);
                }

                /* Contact Title */
                .contact-title {
                    font-size: var(--text-xl);
                    margin-bottom: var(--spacing-md);
                    color: var(--color-text-primary);
                    font-weight: 700;
                }

                @media (min-width: 768px) {
                    .contact-title {
                        font-size: var(--text-2xl);
                    }
                }

                /* Contact Lines */
                .contact-lines p {
                    color: var(--color-text-secondary);
                    font-size: var(--text-sm);
                    line-height: 1.8;
                    margin-bottom: 0.25rem;
                }

                @media (min-width: 768px) {
                    .contact-lines p {
                        font-size: var(--text-base);
                    }
                }

                /* Contact Link */
                .contact-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: var(--spacing-lg);
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
                    color: white;
                    text-decoration: none;
                    font-size: var(--text-sm);
                    font-weight: 600;
                    border-radius: var(--radius-full);
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
                }

                .contact-link:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
                }

                .contact-link svg {
                    transition: transform 0.3s ease;
                }

                .contact-link:hover svg {
                    transform: translateX(4px);
                }

                /* Map Section */
                .contact-map-wrapper {
                    margin-top: var(--spacing-3xl);
                    animation: fadeInUp 0.8s ease-out 0.3s backwards;
                }

                .map-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-xl);
                }

                .map-pin-icon {
                    font-size: 2rem;
                    animation: bounce 2s ease-in-out infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .map-title {
                    font-size: var(--text-2xl);
                    color: var(--color-text-primary);
                    margin: 0;
                }

                .contact-map {
                    position: relative;
                    overflow: hidden;
                    border: 2px solid var(--color-border-primary);
                    border-radius: var(--radius-xl);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                    transition: all 0.4s ease;
                }

                .contact-map:hover {
                    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
                    transform: translateY(-4px);
                }

                .map-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), transparent);
                    pointer-events: none;
                }

                .contact-map iframe {
                    display: block;
                    width: 100%;
                    transition: filter 0.3s ease;
                }

                .contact-map:hover iframe {
                    filter: grayscale(80%) invert(92%) contrast(83%) !important;
                }

                @media (min-width: 768px) {
                    .contact-map-wrapper {
                        margin-top: var(--spacing-4xl);
                    }

                    .contact-map iframe {
                        height: 450px;
                    }
                }
            `}</style>
        </section>
    );
};

export default ContactSection;