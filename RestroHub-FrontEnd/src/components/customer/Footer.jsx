import React from 'react';
import { useSiteData } from '@context/SiteContext.jsx';

// ============================================
// FOOTER COMPONENT
// Site footer with social links
// ============================================

const Footer = () => {
    const { siteData } = useSiteData();

    if (!siteData) return null;

    const { footer, navigation } = siteData;
    const currentYear = new Date().getFullYear();

    const NAV_ITEMS = [
        { label: "Home", href: "#hero" },
        { label: "About", href: "#about" },
        { label: "Menu", href: "#menu" },
        { label: "Gallery", href: "#gallery" },
        { label: "Reservations", href: "#reservations" },
        { label: "Contact", href: "#contact" }
    ];

    return (
        <footer className="footer">
            <div className="container">
                {/* Main Footer Content */}
                <div className="footer-main">
                    {/* Brand */}
                    <div className="footer-brand">
                        <a href="/" className="footer-logo font-heading">
                            {navigation.name}
                        </a>
                        <p className="footer-tagline">{navigation.fullName}</p>
                    </div>

                    {/* Navigation */}
                    <div className="footer-nav">
                        {NAV_ITEMS.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="footer-nav-link"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} {navigation.fullName}. All rights reserved.
                    </p>

                    {footer?.links && (
                        <div className="footer-legal">
                            {footer.links.map((link, index) => (
                                <a key={index} href={link.href} className="footer-legal-link">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .footer {                                                                   
                    background-color: var(--color-footer-bg);
                    border-top: 1px solid var(--color-border-primary);
                    padding: var(--spacing-2xl) 0 var(--spacing-lg);
                }

                @media (min-width: 768px) {
                    .footer {
                        padding: var(--spacing-3xl) 0 var(--spacing-xl);
                    }
                }

                .footer-main {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-xl);
                    padding-bottom: var(--spacing-xl);
                    border-bottom: 1px solid var(--color-border-primary);
                }

                @media (min-width: 768px) {
                    .footer-main {
                        flex-direction: row;
                        justify-content: space-between;
                        padding-bottom: var(--spacing-2xl);
                    }
                }

                .footer-brand {
                    text-align: center;
                }

                @media (min-width: 768px) {
                    .footer-brand {
                        text-align: left;
                    }
                }

                .footer-logo {
                    font-size: var(--text-2xl);
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    color: var(--color-text-primary);
                    text-decoration: none;
                    transition: color var(--transition-normal);
                }

                .footer-logo:hover {
                    color: var(--color-primary);
                }

                @media (min-width: 768px) {
                    .footer-logo {
                        font-size: var(--text-3xl);
                    }
                }

                .footer-tagline {
                    color: var(--color-text-muted);
                    font-size: var(--text-sm);
                    margin-top: var(--spacing-sm);
                }

                .footer-nav {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: var(--spacing-md) var(--spacing-lg);
                }

                .footer-nav-link {
                    color: var(--color-text-secondary);
                    text-decoration: none;
                    font-size: var(--text-sm);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    transition: color var(--transition-normal);
                }

                .footer-nav-link:hover {
                    color: var(--color-primary-hover);
                }

                .footer-social {
                    display: flex;
                    gap: var(--spacing-md);
                }

                .footer-social-link {
                    width: 40px;
                    height: 40px;
                    background: transparent;
                    border: 1px solid var(--color-border-primary);
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-text-primary);
                    text-decoration: none;
                    transition: all var(--transition-normal);
                }

                .footer-social-link:hover {
                    background-color: var(--color-button-bg);
                    border-color: var(--color-button-bg);
                    color: var(--color-button-text);
                }

                .footer-social-link svg {
                    width: 18px;
                    height: 18px;
                }

                .footer-bottom {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-md);
                    padding-top: var(--spacing-lg);
                }

                @media (min-width: 768px) {
                    .footer-bottom {
                        flex-direction: row;
                        justify-content: space-between;
                        padding-top: var(--spacing-xl);
                    }
                }

                .footer-copyright {
                    color: var(--color-text-muted);
                    font-size: var(--text-sm);
                    text-align: center;
                }

                .footer-legal {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: var(--spacing-lg);
                }

                .footer-legal-link {
                    color: var(--color-text-muted);
                    text-decoration: none;
                    font-size: var(--text-sm);
                    transition: color var(--transition-normal);
                }

                .footer-legal-link:hover {
                    color: var(--color-primary-hover);
                }
            `}</style>
        </footer>
    );
};

export default Footer;