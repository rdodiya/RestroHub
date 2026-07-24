import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSiteData } from '@context/SiteContext.jsx';

const Navigation = () => {
    const { siteData } = useSiteData();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Navbar background change on scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!siteData) return null;

    const handleLogoClick = (e) => {
        e.preventDefault();
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const NAV_ITEMS = [
        { label: "Home", href: "#hero" },
        { label: "About", href: "#about" },
        { label: "Menu", href: "#menu" },
        { label: "Gallery", href: "#gallery" },
        { label: "Reservations", href: "#reservations" },
        { label: "Contact", href: "#contact" }
    ];

    return (
        <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={handleLogoClick}>
                    {siteData.navigation.logo ? (
                        <img src={siteData.navigation.logo} alt={siteData.navigation.name} />
                    ) : (
                        siteData.navigation.name
                    )}
                </Link>

                <div className="nav-links">
                    {NAV_ITEMS.map(item => (
                        <a key={item.href} href={item.href} className="nav-link">
                            {item.label}
                        </a>
                    ))}
                </div>

                <button
                    className="nav-mobile-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? "✕" : "☰"}
                </button>
            </div>

            <div className={`nav-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                {NAV_ITEMS.map(item => (
                    <a
                        key={item.href}
                        href={item.href}
                        className="nav-mobile-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {item.label}
                    </a>
                ))}
            </div>

            <style>{`
                .nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: var(--z-fixed, 1000);
                    padding: 12px 16px;
                    background: transparent;
                    transition:
                        background-color var(--transition-normal),
                        box-shadow var(--transition-normal),
                        padding var(--transition-normal);
                }

                .nav-scrolled {
                    background: var(--color-header-bg);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border-bottom: 1px solid var(--color-border-primary);
                }

                @media (min-width: 768px) {
                    .nav {
                        padding: var(--spacing-lg) var(--spacing-xl);
                    }

                    .nav-scrolled {
                        padding: var(--spacing-md) var(--spacing-xl);
                    }
                }

                .nav-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: var(--spacing-md);
                }

                .nav-logo {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    color: var(--color-text-primary);
                    font-size: var(--text-xl);
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    transition: opacity var(--transition-normal);
                }

                .nav-logo:hover {
                    opacity: 0.85;
                }

                @media (min-width: 768px) {
                    .nav-logo {
                        font-size: var(--text-2xl);
                    }
                }

                .nav-logo img {
                    height: 42px;
                    width: auto;
                    display: block;
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
                    position: relative;
                    color: var(--color-text-primary);
                    text-decoration: none;
                    font-size: var(--text-sm);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    padding: var(--spacing-xs) 0;
                    transition: color var(--transition-normal);
                }

                .nav-link:hover {
                    color: var(--color-primary);
                }

                .nav-link::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: -4px;
                    width: 0;
                    height: 2px;
                    background: var(--color-primary);
                    transition: width var(--transition-normal);
                }

                .nav-link:hover::after {
                    width: 100%;
                }

                .nav-mobile-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 42px;
                    height: 42px;
                    background: transparent;
                    border: 1px solid var(--color-border-primary);
                    color: var(--color-text-primary);
                    cursor: pointer;
                    font-size: 24px;
                    transition: all var(--transition-normal);
                }

                .nav-mobile-btn:hover {
                    border-color: var(--color-primary);
                    color: var(--color-primary);
                }

                @media (min-width: 768px) {
                    .nav-mobile-btn {
                        display: none;
                    }
                }

                .nav-mobile-menu {
                    position: fixed;
                    inset: 0;
                    z-index: calc(var(--z-fixed, 1000) - 1);
                    background: var(--color-bg-primary);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: var(--spacing-xl);

                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;

                    transition:
                        transform 0.35s ease,
                        opacity 0.35s ease,
                        visibility 0.35s ease;
                }

                .nav-mobile-menu.open {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }

                .nav-mobile-link {
                    color: var(--color-text-primary);
                    text-decoration: none;
                    font-size: var(--text-xl);
                    font-weight: 600;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    transition: color var(--transition-normal);
                }

                .nav-mobile-link:hover {
                    color: var(--color-primary);
                }

                .nav-mobile-link:active {
                    color: var(--color-primary-hover);
                }
            `}</style>
        </nav>
    );
};

export default Navigation;