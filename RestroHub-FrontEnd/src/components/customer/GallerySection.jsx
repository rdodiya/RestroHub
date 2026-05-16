import React, { useState } from 'react';
import { useSiteData } from '@context/SiteContext.jsx';

// ============================================
// GALLERY SECTION COMPONENT
// Masonry-style image gallery with lightbox
// ============================================

const GallerySection = () => {
    const { siteData } = useSiteData();
    const [selectedImage, setSelectedImage] = useState(null);

    if (!siteData) return null;

    const { gallery } = siteData;

    // Get grid class based on span type
    const getSpanClass = (span) => {
        switch (span) {
            case 'large':
                return 'gallery-item-large';
            case 'wide':
                return 'gallery-item-wide';
            default:
                return '';
        }
    };

    return (
        <section id="features" className="gallery section">
            <div className="container">
                {/* Header */}
                <div className="gallery-header">
                    <p className="section-subtitle">{gallery.subtitle}</p>
                    <h2 className="section-title font-heading">{gallery.title}</h2>
                </div>

                {/* Gallery Grid */}
                <div className="gallery-grid">
                    {gallery.images.map((image, index) => (
                        <div 
                            key={index} 
                            className={`gallery-item ${getSpanClass(image.span)}`}
                            onClick={() => setSelectedImage(image)}
                        >
                            <img 
                                src={image.src} 
                                alt={image.alt}
                                loading="lazy"
                            />
                            <div className="gallery-item-overlay">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div className="lightbox" onClick={() => setSelectedImage(null)}>
                    <button className="lightbox-close" aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img 
                        src={selectedImage.src} 
                        alt={selectedImage.alt}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <style>{`
                .gallery {
                    background-color: var(--color-bg-secondary);
                }

                .gallery-header {
                    text-align: center;
                    margin-bottom: var(--spacing-2xl);
                }

                @media (min-width: 768px) {
                    .gallery-header {
                        margin-bottom: var(--spacing-3xl);
                    }
                }

                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--spacing-sm);
                }

                @media (min-width: 768px) {
                    .gallery-grid {
                        grid-template-columns: repeat(4, 1fr);
                        gap: var(--spacing-md);
                    }
                }

                .gallery-item {
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                }

                .gallery-item img {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    transition: transform var(--transition-slow);
                }

                @media (min-width: 768px) {
                    .gallery-item img {
                        height: 200px;
                    }
                }

                .gallery-item:hover img {
                    transform: scale(1.1);
                }

                .gallery-item-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity var(--transition-normal);
                }

                .gallery-item:hover .gallery-item-overlay {
                    opacity: 1;
                }

                .gallery-item-overlay svg {
                    width: 32px;
                    height: 32px;
                    color: var(--color-text-primary);
                }

                .gallery-item-large {
                    grid-column: span 2;
                    grid-row: span 2;
                }

                .gallery-item-large img {
                    height: 100%;
                    min-height: 308px;
                }

                @media (min-width: 768px) {
                    .gallery-item-large img {
                        min-height: 416px;
                    }
                }

                .gallery-item-wide {
                    grid-column: span 2;
                }

                /* Lightbox */
                .lightbox {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: var(--z-modal);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-xl);
                    animation: fadeIn 0.3s ease;
                }

                .lightbox img {
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                }

                .lightbox-close {
                    position: absolute;
                    top: var(--spacing-lg);
                    right: var(--spacing-lg);
                    background: none;
                    border: none;
                    color: var(--color-text-primary);
                    cursor: pointer;
                    padding: var(--spacing-sm);
                    transition: color var(--transition-normal);
                }

                .lightbox-close:hover {
                    color: var(--color-primary);
                }

                .lightbox-close svg {
                    width: 32px;
                    height: 32px;
                }
            `}</style>
        </section>
    );
};

export default GallerySection;
