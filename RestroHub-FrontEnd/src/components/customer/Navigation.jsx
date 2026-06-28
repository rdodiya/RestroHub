import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSiteData } from '@context/SiteContext.jsx';
import { useCart } from '@context/CartContext';

const Navigation = ({ onCartClick }) => {
    const { siteData } = useSiteData();
    const { itemCount } = useCart();
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

    return (
        <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={handleLogoClick}>
                    {siteData.brand.logo ? (
                        <img src={siteData.brand.logo} alt={siteData.brand.name} />
                    ) : (
                        siteData.brand.name
                    )}
                </Link>

                <div className="nav-links">
                    {siteData.navigation.map((item, index) => (
                        <a key={index} href={item.href} className="nav-link">
                            {item.label}
                        </a>
                    ))}
                </div>

                <button
                    onClick={onCartClick}
                    className="nav-cart-btn"
                    aria-label={`Cart with ${itemCount} items`}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    {itemCount > 0 && (
                        <span className="nav-cart-badge">{itemCount}</span>
                    )}
                </button>

                <button 
                    className="nav-mobile-btn" 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? "✕" : "☰"}
                </button>
            </div>

            <div className={`nav-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                {siteData.navigation.map((item, index) => (
                    <a 
                        key={index} 
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
                    transition: all var(--transition-normal, 0.3s); 
                }
                .nav-scrolled { 
                    background: white; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
                }
                @media (min-width: 768px) {
                    .nav { padding: var(--spacing-lg, 20px) var(--spacing-xl, 40px); }
                }
                .nav-container { 
                    max-width: 1280px; 
                    margin: 0 auto; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    gap: 12px; 
                    flex-wrap: nowrap; 
                }
                .nav-logo { 
                    display: flex; 
                    align-items: center; 
                    font-size: var(--text-lg, 18px); 
                    font-weight: 700; 
                    letter-spacing: 0.1em; 
                    color: var(--color-text-primary, #333); 
                    text-decoration: none; 
                }
                @media (min-width: 768px) {
                    .nav-logo { font-size: var(--text-2xl, 24px); }
                }
                .nav-logo img { 
                    height: 40px; 
                    width: auto; 
                }
                .nav-links { 
                    display: none; 
                    align-items: center; 
                    gap: var(--spacing-xl, 20px); 
                }
                .nav-cart-btn { 
                    position: relative; display: none; align-items: center; justify-content: center;
                    background: none; border: 1px solid var(--color-border-primary, #d1d5db);
                    border-radius: 50%; width: 40px; height: 40px; cursor: pointer;
                    color: var(--color-text-primary, #333); transition: all 0.2s;
                }
                .nav-cart-btn:hover {
                    border-color: var(--color-primary, #f59e0b);
                    color: var(--color-primary, #f59e0b);
                }
                .nav-cart-badge {
                    position: absolute; top: -4px; right: -4px;
                    background: var(--color-primary, #f59e0b); color: #fff;
                    font-size: 11px; font-weight: 700; min-width: 18px; height: 18px;
                    border-radius: 9px; display: flex; align-items: center;
                    justify-content: center; line-height: 1;
                }
                @media (min-width: 768px) {
                    .nav-links { display: flex; }
                    .nav-cart-btn { display: flex; }
                }
                .nav-link { 
                    color: var(--color-text-primary, #333); 
                    text-decoration: none; 
                    font-size: var(--text-sm, 13px); 
                    font-weight: 600;
                    letter-spacing: 0.15em; 
                    text-transform: uppercase; 
                    transition: color var(--transition-normal, 0.3s); 
                }
                .nav-link:hover { 
                    color: var(--color-primary, #007bff); 
                }
                .nav-mobile-btn { 
                    display: block; 
                    background: none; 
                    border: none; 
                    color: var(--color-text-primary, #333); 
                    font-size: 24px; 
                    cursor: pointer; 
                    padding: var(--spacing-sm, 8px); 
                }
                @media (min-width: 768px) {
                    .nav-mobile-btn { display: none; }
                }
                .nav-mobile-menu {
                    position: fixed; 
                    top: 0; 
                    left: 0; 
                    right: 0;
                    height: 100vh;
                    background: var(--color-bg-primary, white); 
                    display: flex; 
                    flex-direction: column;
                    align-items: center; 
                    justify-content: center; 
                    gap: var(--spacing-xl, 30px);
                    transform: translateY(-100%); 
                    transition: all var(--transition-normal, 0.4s);
                    opacity: 0;
                    visibility: hidden;
                }
                .nav-mobile-menu.open { 
                    transform: translateY(0); 
                    opacity: 1;
                    visibility: visible;
                }
                .nav-mobile-link { 
                    color: var(--color-text-primary, #333); 
                    text-decoration: none; 
                    font-size: var(--text-lg, 18px); 
                    letter-spacing: 0.15em; 
                    text-transform: uppercase; 
                    transition: color var(--transition-normal, 0.3s); 
                }
                .nav-mobile-link:hover { 
                    color: var(--color-primary, #007bff); 
                }
            `}</style>
        </nav>
    );
};

export default Navigation;