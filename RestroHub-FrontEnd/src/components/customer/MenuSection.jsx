import React, { useState, useEffect, useCallback } from 'react';
import { useSiteData } from '@context/SiteContext.jsx';

// ============================================
// MENU SECTION COMPONENT
// Interactive tabbed menu display — authentic restaurant menu look
// Click any item to view full details in a modal
// ============================================

const VegDot = ({ isVeg, size = 'sm' }) => (
    <span
        className={`veg-dot veg-dot-${size} ${isVeg ? 'veg' : 'non-veg'}`}
        title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
        aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
        <span className="veg-dot-inner" />
    </span>
);

const FoodDetailModal = ({ item, onClose }) => {
    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        // Lock background scroll while modal is open
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    if (!item) return null;

    const isUnavailable = item.isAvailable === false;

    return (
        <div
            className="food-modal-backdrop"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={item.name}
        >
            <div className="food-modal" onClick={(e) => e.stopPropagation()}>
                <button className="food-modal-close" onClick={onClose} aria-label="Close">
                    ✕
                </button>

                {item.image && (
                    <div className="food-modal-image">
                        <img src={item.image} alt={item.name} />
                        {isUnavailable && (
                            <span className="sold-out-badge sold-out-badge-lg">Sold Out</span>
                        )}
                    </div>
                )}

                <div className="food-modal-body">
                    <div className="food-modal-name-row">
                        <VegDot isVeg={item.isVeg} size="lg" />
                        <h3 className="food-modal-name font-heading">{item.name}</h3>
                    </div>

                    {item.description && (
                        <p className="food-modal-description">{item.description}</p>
                    )}

                    <div className="food-modal-meta">
                        <span className={`food-modal-veg-label ${item.isVeg ? 'veg' : 'non-veg'}`}>
                            {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                        </span>
                        {isUnavailable && (
                            <span className="food-modal-status">Currently Unavailable</span>
                        )}
                    </div>

                    <p className="food-modal-price font-heading">
                        {item.price === 'varies' ? item.price : `$${Number(item.price).toFixed(2)}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

const MenuSection = () => {
    const { siteData } = useSiteData();
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const menu = siteData?.menu || {};

    // Safely extract category names list
    const categoryList = (menu.categories || []).map((cat) =>
        typeof cat === 'string' ? cat : cat?.name || `Category ${cat?.categoryId || ''}`
    );

    // Set initial active category
    useEffect(() => {
        if (categoryList.length > 0 && (!activeCategory || !categoryList.includes(activeCategory))) {
            setActiveCategory(categoryList[0]);
        }
    }, [categoryList, activeCategory]);

    const openItem = useCallback((item) => setSelectedItem(item), []);
    const closeItem = useCallback(() => setSelectedItem(null), []);

    if (!siteData) return null;

    // Safely resolve items for activeCategory
    const getItemsForActiveCategory = () => {
        if (!activeCategory) return [];
        if (menu.items && menu.items[activeCategory]) {
            return menu.items[activeCategory];
        }
        if (Array.isArray(menu.categories)) {
            const foundCategory = menu.categories.find(
                (c) => typeof c === 'object' && (c.name === activeCategory || String(c.categoryId) === String(activeCategory))
            );
            if (foundCategory && Array.isArray(foundCategory.foods)) {
                return foundCategory.foods.map((f) => ({
                    id: f.foodId ?? f.id,
                    name: f.name,
                    description: f.description,
                    image: f.imageUrl || f.image,
                    price: f.price,
                    isVeg: f.isVeg,
                    isAvailable: f.isAvailable,
                }));
            }
        }
        return [];
    };

    const items = getItemsForActiveCategory();

    return (
        <section id="how-it-works" className="menu section">
            <div className="container">
                {/* Header */}
                <div className="menu-header">
                    <p className="section-subtitle">{menu.subtitle || "Explore our dishes"}</p>
                    <h2 className="section-title font-heading">{menu.title || "Our Menu"}</h2>
                </div>

                {/* Category Tabs */}
                <div className="menu-tabs">
                    {categoryList.map((category) => (
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
                    {items.map((item, index) => (
                        <button
                            key={item.id ?? index}
                            type="button"
                            onClick={() => openItem(item)}
                            className={`menu-item fade-in ${item.isAvailable === false ? 'unavailable' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {item.image && (
                                <div className="menu-item-image">
                                    <img src={item.image} alt={item.name} loading="lazy" />
                                    {item.isAvailable === false && (
                                        <span className="sold-out-badge">Sold Out</span>
                                    )}
                                </div>
                            )}

                            <div className="menu-item-body">
                                <div className="menu-item-content">
                                    <div className="menu-item-name-row">
                                        <VegDot isVeg={item.isVeg} />
                                        <h3 className="menu-item-name font-heading">{item.name}</h3>
                                    </div>
                                    {item.description && (
                                        <p className="menu-item-description">{item.description}</p>
                                    )}
                                </div>
                                <p className="menu-item-price font-heading">
                                    {item.price === 'varies' ? item.price : `$${Number(item.price).toFixed(2)}`}
                                </p>
                            </div>
                        </button>
                    ))}

                    {items.length === 0 && (
                        <p className="menu-empty">No items available in this category yet.</p>
                    )}
                </div>

                {/* Download Menu Button */}
                <div className="menu-footer">
                    <a href="#" className="btn btn-outline-accent">
                        Download Full Menu
                    </a>
                </div>
            </div>

            {/* Food Detail Modal */}
            {selectedItem && (
                <FoodDetailModal item={selectedItem} onClose={closeItem} />
            )}

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
                    text-transform: capitalize;
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
                    background-color: var(--color-button-bg);
                    border-color: var(--color-primary);
                    color: var(--color-button-text);
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

                .menu-empty {
                    grid-column: 1 / -1;
                    text-align: center;
                    color: var(--color-text-muted);
                    font-size: var(--text-sm);
                    padding: var(--spacing-xl) 0;
                }

                /* Menu Card */

                .menu-item {
                    display: flex;
                    align-items: stretch;
                    gap: var(--spacing-md);
                    border: 1px solid var(--color-border-primary);
                    background: var(--color-bg-secondary);
                    transition: border-color var(--transition-normal),
                        transform var(--transition-normal);
                    overflow: hidden;
                    text-align: left;
                    padding: 0;
                    cursor: pointer;
                    width: 100%;
                    font: inherit;
                    color: inherit;
                }

                @media (min-width: 768px) {
                    .menu-item {
                        gap: var(--spacing-lg);
                    }
                }

                .menu-item:hover {
                    border-color: var(--color-primary);
                    transform: translateY(-2px);
                }

                .menu-item:hover .menu-item-name {
                    color: var(--color-primary);
                }

                .menu-item:focus-visible {
                    outline: 2px solid var(--color-primary);
                    outline-offset: 2px;
                }

                .menu-item.unavailable {
                    opacity: 0.55;
                }

                .menu-item.unavailable .menu-item-image img {
                    filter: grayscale(.6);
                }

                /* Food Image */

                .menu-item-image {
                    position: relative;
                    flex-shrink: 0;
                    width: 96px;
                    align-self: stretch;
                }

                @media (min-width: 768px) {
                    .menu-item-image {
                        width: 120px;
                    }
                }

                .menu-item-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .sold-out-badge {
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    background: var(--color-primary);
                    color: var(--color-button-text);
                    font-size: 10px;
                    letter-spacing: .05em;
                    text-transform: uppercase;
                    padding: 2px 6px;
                    border-radius: var(--radius-sm);
                }

                /* Item Body */

                .menu-item-body {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 0;
                    min-width: 0;
                }

                .menu-item-image + .menu-item-body {
                    padding-left: 0;
                }

                .menu-item:not(:has(.menu-item-image)) .menu-item-body {
                    padding-left: var(--spacing-md);
                }

                @media (min-width: 768px) {
                    .menu-item-body {
                        padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-lg) 0;
                    }

                    .menu-item:not(:has(.menu-item-image)) .menu-item-body {
                        padding-left: var(--spacing-lg);
                    }
                }

                .menu-item-content {
                    flex: 1;
                    min-width: 0;
                    padding-right: var(--spacing-md);
                }

                .menu-item-name-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-sm);
                }

                .menu-item-name {
                    font-size: var(--text-lg);
                    color: var(--color-text-primary);
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
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Veg Dot */

                .veg-dot {
                    flex-shrink: 0;
                    border: 1.5px solid;
                    border-radius: 2px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .veg-dot-sm {
                    width: 14px;
                    height: 14px;
                }

                .veg-dot-lg {
                    width: 20px;
                    height: 20px;
                    border-width: 2px;
                }

                .veg-dot.veg {
                    border-color: #22c55e;
                }

                .veg-dot.non-veg {
                    border-color: #ef4444;
                }

                .veg-dot-inner {
                    width: 45%;
                    height: 45%;
                    border-radius: 50%;
                }

                .veg-dot.veg .veg-dot-inner {
                    background: #22c55e;
                }

                .veg-dot.non-veg .veg-dot-inner {
                    background: #ef4444;
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

                /* Modal */

                .food-modal-backdrop {
                    position: fixed;
                    inset: 0;
                    z-index: var(--z-modal, 2000);
                    background: rgba(0,0,0,.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-md);
                    animation: modal-fade-in .2s ease;
                }

                @keyframes modal-fade-in {
                    from { opacity:0; }
                    to { opacity:1; }
                }

                .food-modal {
                    position: relative;
                    width: 100%;
                    max-width: 560px;
                    max-height: 90vh;
                    overflow-y: auto;
                    background: var(--color-bg-primary);
                    border: 1px solid var(--color-border-primary);
                    animation: modal-scale-in .25s ease;
                }

                @keyframes modal-scale-in {
                    from {
                        opacity:0;
                        transform:scale(.95) translateY(10px);
                    }
                    to {
                        opacity:1;
                        transform:scale(1) translateY(0);
                    }
                }

                .food-modal-close {
                    position: absolute;
                    top: var(--spacing-md);
                    right: var(--spacing-md);
                    z-index: 1;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    background: var(--color-button-bg);
                    color: var(--color-button-text);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background var(--transition-normal);
                }

                .food-modal-close:hover {
                    background: var(--color-primary);
                }

                .food-modal-image {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 4/3;
                }

                .food-modal-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .sold-out-badge-lg {
                    top: var(--spacing-md);
                    left: var(--spacing-md);
                    font-size: var(--text-xs);
                    padding: 4px 10px;
                }

                .food-modal-body {
                    padding: var(--spacing-lg) var(--spacing-xl);
                }

                @media (min-width:768px){
                    .food-modal-body{
                        padding:var(--spacing-xl) var(--spacing-2xl);
                    }
                }

                .food-modal-name-row{
                    display:flex;
                    align-items:center;
                    gap:var(--spacing-md);
                    margin-bottom:var(--spacing-md);
                }

                .food-modal-name{
                    font-size:var(--text-2xl);
                    color:var(--color-text-primary);
                }

                @media (min-width:768px){
                    .food-modal-name{
                        font-size:var(--text-3xl,28px);
                    }
                }

                .food-modal-description{
                    color:var(--color-text-secondary);
                    font-size:var(--text-base);
                    line-height:1.8;
                    margin-bottom:var(--spacing-lg);
                }

                .food-modal-meta{
                    display:flex;
                    flex-wrap:wrap;
                    align-items:center;
                    gap:var(--spacing-md);
                    margin-bottom:var(--spacing-lg);
                }

                .food-modal-veg-label{
                    font-size:var(--text-xs);
                    letter-spacing:.08em;
                    text-transform:uppercase;
                    padding:4px 10px;
                    border-radius:var(--radius-sm);
                    border:1px solid;
                }

                .food-modal-veg-label.veg{
                    color:var(--color-primary);
                    border-color:var(--color-primary);
                    background:transparent;
                }

                .food-modal-veg-label.non-veg{
                    color:#ef4444;
                    border-color:#ef4444;
                    background:transparent;
                }

                .food-modal-status{
                    font-size:var(--text-xs);
                    letter-spacing:.08em;
                    text-transform:uppercase;
                    color:var(--color-text-muted);
                }

                .food-modal-price{
                    font-size:var(--text-3xl,28px);
                    color:var(--color-primary);
                }
            `}</style>
        </section>
    );
};

export default MenuSection;

// import React, { useState, useEffect } from 'react';
// import { useSiteData } from '@context/SiteContext.jsx';

// // ============================================
// // MENU SECTION COMPONENT
// // Interactive tabbed menu display — authentic restaurant menu look
// // ============================================

// const VegDot = ({ isVeg }) => (
//     <span
//         className={`veg-dot ${isVeg ? 'veg' : 'non-veg'}`}
//         title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
//         aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
//     >
//         <span className="veg-dot-inner" />
//     </span>
// );

// const MenuSection = () => {
//     const { siteData } = useSiteData();
//     const [activeCategory, setActiveCategory] = useState(null);

//     // Categories come from the real Menu module now, so default to the
//     // first one once siteData loads rather than a hardcoded key.
//     useEffect(() => {
//         if (siteData?.menu?.categories?.length && !activeCategory) {
//             setActiveCategory(siteData.menu.categories[0]);
//         }
//     }, [siteData, activeCategory]);

//     if (!siteData) return null;

//     const { menu } = siteData;
//     const items = menu.items?.[activeCategory] || [];

//     return (
//         <section id="how-it-works" className="menu section">
//             <div className="container">
//                 {/* Header */}
//                 <div className="menu-header">
//                     <p className="section-subtitle">{menu.subtitle}</p>
//                     <h2 className="section-title font-heading">{menu.title}</h2>
//                 </div>

//                 {/* Category Tabs */}
//                 <div className="menu-tabs">
//                     {menu.categories.map((category) => (
//                         <button
//                             key={category}
//                             onClick={() => setActiveCategory(category)}
//                             className={`menu-tab ${activeCategory === category ? 'active' : ''}`}
//                         >
//                             {category}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Menu Items */}
//                 <div className="menu-grid">
//                     {items.map((item, index) => (
//                         <div
//                             key={item.id ?? index}
//                             className={`menu-item fade-in ${item.isAvailable === false ? 'unavailable' : ''}`}
//                             style={{ animationDelay: `${index * 0.1}s` }}
//                         >
//                             {item.image && (
//                                 <div className="menu-item-image">
//                                     <img src={item.image} alt={item.name} loading="lazy" />
//                                     {item.isAvailable === false && (
//                                         <span className="sold-out-badge">Sold Out</span>
//                                     )}
//                                 </div>
//                             )}

//                             <div className="menu-item-body">
//                                 <div className="menu-item-content">
//                                     <div className="menu-item-name-row">
//                                         <VegDot isVeg={item.isVeg} />
//                                         <h3 className="menu-item-name font-heading">{item.name}</h3>
//                                     </div>
//                                     {item.description && (
//                                         <p className="menu-item-description">{item.description}</p>
//                                     )}
//                                 </div>
//                                 <p className="menu-item-price font-heading">
//                                     {item.price === 'varies' ? item.price : `$${Number(item.price).toFixed(2)}`}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}

//                     {items.length === 0 && (
//                         <p className="menu-empty">No items available in this category yet.</p>
//                     )}
//                 </div>

//                 {/* Download Menu Button */}
//                 <div className="menu-footer">
//                     <a href="#" className="btn btn-outline-accent">
//                         Download Full Menu
//                     </a>
//                 </div>
//             </div>

//             <style>{`
//                 .menu {
//                     background-color: var(--color-bg-primary);
//                 }

//                 .menu-header {
//                     text-align: center;
//                     margin-bottom: var(--spacing-2xl);
//                 }

//                 @media (min-width: 768px) {
//                     .menu-header {
//                         margin-bottom: var(--spacing-3xl);
//                     }
//                 }

//                 .menu-tabs {
//                     display: flex;
//                     flex-wrap: wrap;
//                     justify-content: center;
//                     gap: var(--spacing-sm);
//                     margin-bottom: var(--spacing-xl);
//                     text-transform: capitalize;
//                 }

//                 @media (min-width: 768px) {
//                     .menu-tabs {
//                         gap: var(--spacing-md);
//                         margin-bottom: var(--spacing-2xl);
//                     }
//                 }

//                 .menu-tab {
//                     padding: var(--spacing-sm) var(--spacing-md);
//                     background: transparent;
//                     border: 1px solid var(--color-border-primary);
//                     color: var(--color-text-secondary);
//                     font-size: var(--text-xs);
//                     letter-spacing: 0.1em;
//                     text-transform: uppercase;
//                     cursor: pointer;
//                     transition: all var(--transition-normal);
//                 }

//                 @media (min-width: 768px) {
//                     .menu-tab {
//                         padding: var(--spacing-sm) var(--spacing-lg);
//                         font-size: var(--text-sm);
//                     }
//                 }

//                 .menu-tab:hover,
//                 .menu-tab.active {
//                     border-color: var(--color-primary);
//                     color: var(--color-primary);
//                 }

//                 .menu-grid {
//                     display: grid;
//                     gap: var(--spacing-md);
//                 }

//                 @media (min-width: 768px) {
//                     .menu-grid {
//                         grid-template-columns: repeat(2, 1fr);
//                         gap: var(--spacing-xl);
//                     }
//                 }

//                 .menu-empty {
//                     grid-column: 1 / -1;
//                     text-align: center;
//                     color: var(--color-text-muted);
//                     font-size: var(--text-sm);
//                     padding: var(--spacing-xl) 0;
//                 }

//                 .menu-item {
//                     display: flex;
//                     align-items: stretch;
//                     gap: var(--spacing-md);
//                     border: 1px solid var(--color-border-secondary);
//                     transition: border-color var(--transition-normal);
//                     overflow: hidden;
//                 }

//                 @media (min-width: 768px) {
//                     .menu-item {
//                         gap: var(--spacing-lg);
//                     }
//                 }

//                 .menu-item:hover {
//                     border-color: rgba(245, 158, 11, 0.5);
//                 }

//                 .menu-item:hover .menu-item-name {
//                     color: var(--color-primary);
//                 }

//                 .menu-item.unavailable {
//                     opacity: 0.55;
//                 }

//                 .menu-item.unavailable .menu-item-image img {
//                     filter: grayscale(0.6);
//                 }

//                 /* ── Food image ─────────────────────────────────────────── */
//                 .menu-item-image {
//                     position: relative;
//                     flex-shrink: 0;
//                     width: 96px;
//                     align-self: stretch;
//                 }

//                 @media (min-width: 768px) {
//                     .menu-item-image {
//                         width: 120px;
//                     }
//                 }

//                 .menu-item-image img {
//                     width: 100%;
//                     height: 100%;
//                     object-fit: cover;
//                     display: block;
//                 }

//                 .sold-out-badge {
//                     position: absolute;
//                     top: 6px;
//                     left: 6px;
//                     background: rgba(0, 0, 0, 0.75);
//                     color: #fff;
//                     font-size: 10px;
//                     letter-spacing: 0.05em;
//                     text-transform: uppercase;
//                     padding: 2px 6px;
//                     border-radius: var(--radius-sm);
//                 }

//                 /* ── Item body ──────────────────────────────────────────── */
//                 .menu-item-body {
//                     flex: 1;
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: flex-start;
//                     padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 0;
//                     min-width: 0;
//                 }

//                 .menu-item-image + .menu-item-body {
//                     padding-left: 0;
//                 }

//                 .menu-item:not(:has(.menu-item-image)) .menu-item-body {
//                     padding-left: var(--spacing-md);
//                 }

//                 @media (min-width: 768px) {
//                     .menu-item-body {
//                         padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-lg) 0;
//                     }

//                     .menu-item:not(:has(.menu-item-image)) .menu-item-body {
//                         padding-left: var(--spacing-lg);
//                     }
//                 }

//                 .menu-item-content {
//                     flex: 1;
//                     min-width: 0;
//                     padding-right: var(--spacing-md);
//                 }

//                 .menu-item-name-row {
//                     display: flex;
//                     align-items: center;
//                     gap: var(--spacing-sm);
//                     margin-bottom: var(--spacing-sm);
//                 }

//                 .menu-item-name {
//                     font-size: var(--text-lg);
//                     transition: color var(--transition-normal);
//                 }

//                 @media (min-width: 768px) {
//                     .menu-item-name {
//                         font-size: var(--text-xl);
//                     }
//                 }

//                 .menu-item-description {
//                     color: var(--color-text-muted);
//                     font-size: var(--text-sm);
//                     line-height: 1.6;
//                 }

//                 /* ── Veg / non-veg indicator (classic square-in-square) ──── */
//                 .veg-dot {
//                     flex-shrink: 0;
//                     width: 14px;
//                     height: 14px;
//                     border: 1.5px solid;
//                     border-radius: 2px;
//                     display: inline-flex;
//                     align-items: center;
//                     justify-content: center;
//                 }

//                 .veg-dot.veg {
//                     border-color: #22c55e;
//                 }

//                 .veg-dot.non-veg {
//                     border-color: #ef4444;
//                 }

//                 .veg-dot-inner {
//                     width: 7px;
//                     height: 7px;
//                     border-radius: 50%;
//                 }

//                 .veg-dot.veg .veg-dot-inner {
//                     background: #22c55e;
//                 }

//                 .veg-dot.non-veg .veg-dot-inner {
//                     background: #ef4444;
//                 }

//                 .menu-item-price {
//                     font-size: var(--text-xl);
//                     color: var(--color-primary);
//                     white-space: nowrap;
//                 }

//                 @media (min-width: 768px) {
//                     .menu-item-price {
//                         font-size: var(--text-2xl);
//                     }
//                 }

//                 .menu-footer {
//                     text-align: center;
//                     margin-top: var(--spacing-xl);
//                 }

//                 @media (min-width: 768px) {
//                     .menu-footer {
//                         margin-top: var(--spacing-2xl);
//                     }
//                 }
//             `}</style>
//         </section>
//     );
// };

// export default MenuSection;