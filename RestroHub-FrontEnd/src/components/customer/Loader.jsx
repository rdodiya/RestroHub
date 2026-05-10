import React from 'react';

// ============================================
// LOADER COMPONENT
// Full-screen loading spinner
// ============================================

const Loader = ({ message = "Loading..." }) => {
    return (
        <div className="loader-container">
            <div className="loader-content">
                <div className="loader"></div>
                <p className="loader-text">{message}</p>
            </div>

            <style>{`
                .loader-container {
                    min-height: 100vh;  
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--color-bg-primary);
                }

                .loader-content {
                    text-align: center;
                }

                .loader {
                    margin: 0 auto var(--spacing-md);
                }

                .loader-text {
                    color: var(--color-primary);
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    font-size: var(--text-sm);
                }
            `}</style>
        </div>
    );
};

export default Loader;
