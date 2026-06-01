import React, { useState } from 'react';
import { useSiteData } from '@context/SiteContext.jsx';

// ============================================
// MENU SECTION COMPONENT
// Interactive tabbed menu display
// ============================================

const MenuSection = () => {
    const { siteData } = useSiteData();
    const [activeCategory, setActiveCategory] = useState('starters');

    if (!siteData) return null;

    const { menu } = siteData;

    return (
        <section id="how-it-works" className="menu section">
            <div className="container">
                {/* Header */}
                <div className="menu-header">
                    <p className="section-subtitle">{menu.subtitle}</p>
                    <h2 className="section-title font-heading">{menu.title}</h2>
                </div>

                {/* Category Tabs */}
                <div className="menu-tabs">
                    {menu.categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`menu-tab ${activeCategory === category ? 'active' : ''}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Menu Items */}
                <div className="menu-grid">
                    {menu.items[activeCategory]?.map((item, index) => (
                        <div 
                            key={index} 
                            className="menu-item fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="menu-item-content">
                                <h3 className="menu-item-name font-heading">{item.name}</h3>
                                <p className="menu-item-description">{item.description}</p>
                                {item.dietary && item.dietary.length > 0 && (
                                    <div className="menu-item-dietary">
                                        {item.dietary.map((tag, i) => (
                                            <span key={i} className="dietary-tag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="menu-item-price font-heading">
                                {item.price === 'varies' ? item.price : `$${item.price}`}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Download Menu Button */}
                <div className="menu-footer">
                    <a href="#" className="btn btn-outline-accent">
                        Download Full Menu
                    </a>
                </div>
            </div>

            <style>{`
                .menu {
                    background-color: var(--color-bg-primary);
                }

                .menu-header {
                    text-align: center;
                    margin-bottom: var(--spacing-2xl);
                }

                @media (min-width: 768px) {
                    .menu-header {
                        margin-bottom: var(--spacing-3xl);
                    }
                }

                .menu-tabs {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-xl);
                }

                @media (min-width: 768px) {
                    .menu-tabs {
                        gap: var(--spacing-md);
                        margin-bottom: var(--spacing-2xl);
                    }
                }

                .menu-tab {
                    padding: var(--spacing-sm) var(--spacing-md);
                    background: transparent;
                    border: 1px solid var(--color-border-primary);
                    color: var(--color-text-secondary);
                    font-size: var(--text-xs);
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all var(--transition-normal);
                }

                @media (min-width: 768px) {
                    .menu-tab {
                        padding: var(--spacing-sm) var(--spacing-lg);
                        font-size: var(--text-sm);
                    }
                }

                .menu-tab:hover,
                .menu-tab.active {
                    border-color: var(--color-primary);
                    color: var(--color-primary);
                }

                .menu-grid {
                    display: grid;
                    gap: var(--spacing-md);
                }

                @media (min-width: 768px) {
                    .menu-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: var(--spacing-xl);
                    }
                }

                .menu-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: var(--spacing-md);
                    border: 1px solid var(--color-border-secondary);
                    transition: border-color var(--transition-normal);
                }

                @media (min-width: 768px) {
                    .menu-item {
                        padding: var(--spacing-lg);
                    }
                }

                .menu-item:hover {
                    border-color: rgba(245, 158, 11, 0.5);
                }

                .menu-item:hover .menu-item-name {
                    color: var(--color-primary);
                }

                .menu-item-content {
                    flex: 1;
                    padding-right: var(--spacing-md);
                }

                .menu-item-name {
                    font-size: var(--text-lg);
                    margin-bottom: var(--spacing-sm);
                    transition: color var(--transition-normal);
                }

                @media (min-width: 768px) {
                    .menu-item-name {
                        font-size: var(--text-xl);
                    }
                }

                .menu-item-description {
                    color: var(--color-text-muted);
                    font-size: var(--text-sm);
                    line-height: 1.6;
                }

                .menu-item-dietary {
                    display: flex;
                    gap: var(--spacing-sm);
                    margin-top: var(--spacing-sm);
                }

                .dietary-tag {
                    font-size: var(--text-xs);
                    color: var(--color-primary);
                    background: rgba(245, 158, 11, 0.1);
                    padding: 2px 8px;
                    border-radius: var(--radius-sm);
                    text-transform: lowercase;
                }

                .menu-item-price {
                    font-size: var(--text-xl);
                    color: var(--color-primary);
                    white-space: nowrap;
                }

                @media (min-width: 768px) {
                    .menu-item-price {
                        font-size: var(--text-2xl);
                    }
                }

                .menu-footer {
                    text-align: center;
                    margin-top: var(--spacing-xl);
                }

                @media (min-width: 768px) {
                    .menu-footer {
                        margin-top: var(--spacing-2xl);
                    }
                }
            `}</style>
        </section>
    );
};

export default MenuSection;
