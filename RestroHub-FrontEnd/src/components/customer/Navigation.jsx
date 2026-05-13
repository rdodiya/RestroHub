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
                .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 20px; transition: 0.3s; }
                .nav-scrolled { background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 10px 20px; }
                .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
                .nav-logo { display: flex; align-items: center; text-decoration: none; color: inherit; }
                .nav-logo img { height: 40px; }
                .nav-links { display: flex; gap: 20px; }
                .nav-link { text-decoration: none; color: #333; font-weight: 600; text-transform: uppercase; font-size: 13px; }
                @media (max-width: 768px) {
                    .nav-links { display: none; }
                    .nav-mobile-btn { display: block; background: none; border: none; font-size: 24px; cursor: pointer; }
                }
                .nav-mobile-menu {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                    background: white; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; gap: 30px;
                    transform: translateY(-100%); transition: 0.4s;
                }
                .nav-mobile-menu.open { transform: translateY(0); }
            `}</style>
        </nav>
    );
};

export default Navigation;