import React, { useState, useEffect } from 'react';
import { useSiteData } from '@context/SiteContext.jsx';

// ============================================
// NAVIGATION COMPONENT
// Responsive navbar with scroll effects
// ============================================

const Navigation = () => {
    const { siteData } = useSiteData();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    if (!siteData) return null;

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
            <div className="nav-container">
                {/* Logo */}
                <a href="/" className="nav-logo font-heading">
                    {siteData.brand.logo ? (
                        <img src={siteData.brand.logo} alt={siteData.brand.name} />
                    ) : (
                        siteData.brand.name
                    )}
                </a>

                {/* Desktop Menu */}
                <div className="nav-links">
                    {siteData.navigation.map((item, index) => (
                        <a 
                            key={index} 
                            href={item.href} 
                            className="nav-link"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Reserve Button */}
                <a href="#reservations" className="nav-reserve btn btn-outline">
                    Reserve
                </a>

                {/* Mobile Menu Button */}
                <button 
                    className="nav-mobile-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`nav-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                {siteData.navigation.map((item, index) => (
                    <a 
                        key={index} 
                        href={item.href} 
                        className="nav-mobile-link"
                        onClick={handleNavClick}
                    >
                        {item.label}
                    </a>
                ))}
                <a 
                    href="#reservations" 
                    className="btn btn-outline nav-mobile-reserve"
                    onClick={handleNavClick}
                >
                    Reserve a Table
                </a>
            </div>

            <style>{`
                .nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: var(--z-fixed);
                    padding: 12px 16px;
                    transition: all var(--transition-normal);
                }

                @media (min-width: 768px) {
                    .nav {
                        padding: var(--spacing-lg) var(--spacing-xl);
                    }
                }

                .nav-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap:12px;
                    flex-wrap:nowrap;
                }

                .nav-logo {
                    font-size: var(--text-lg);
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    color: var(--color-text-primary);
                    text-decoration: none;
                }

                @media (min-width: 768px) {
                    .nav-logo {
                        font-size: var(--text-2xl);
                    }
                }

                .nav-logo img {
                    height: 40px;
                    width: auto;
                }

                .nav-links {
                    display: none;
                    align-items: center;
                    gap: var(--spacing-xl);
                }

                @media (min-width: 768px) {
                    .nav-links {
                        display: flex;
                    }
                }

                .nav-link {
                    color: var(--color-text-primary);
                    text-decoration: none;
                    font-size: var(--text-sm);
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    transition: color var(--transition-normal);
                }

                .nav-link:hover {
                    color: var(--color-primary);
                }

                .nav-reserve {
                    display: none;
                    padding: var(--spacing-sm) var(--spacing-lg);
                }

                @media (min-width: 768px) {
                    .nav-reserve {
                        display: block;
                    }
                }

                .nav-mobile-btn {
                    display: block;
                    background: none;
                    border: none;
                    color: var(--color-text-primary);
                    cursor: pointer;
                    padding: var(--spacing-sm);
                }

                @media (min-width: 768px) {
                    .nav-mobile-btn {
                        display: none;
                    }
                }

                .nav-mobile-btn svg {
                    width: 24px;
                    height: 24px;
                }

                .nav-mobile-menu {
                    position: fixed;
                    top: 64px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--color-bg-primary);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-xl);
                    opacity: 0;
                    visibility: hidden;
                    transition: all var(--transition-normal);
                }

                .nav-mobile-menu.open {
                    opacity: 1;
                    visibility: visible;
                }

                .nav-mobile-link {
                    color: var(--color-text-primary);
                    text-decoration: none;
                    font-size: var(--text-lg);
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    transition: color var(--transition-normal);
                }

                .nav-mobile-link:hover {
                    color: var(--color-primary);
                }

                .nav-mobile-reserve {
                    margin-top: var(--spacing-lg);
                }
            `}</style>
        </nav>
    );
};

export default Navigation;
