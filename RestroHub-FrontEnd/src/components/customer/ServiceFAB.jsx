import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

// ============================================
// SERVICE FAB (Floating Action Button)
// Call Waiter / Request Bill from the customer menu
// ============================================

const API_BASE_URL = 'http://localhost:8181/restroly';

const ServiceFAB = () => {
    const { branchId } = useParams();
    const [searchParams] = useSearchParams();
    const tableNumber = parseInt(searchParams.get('table') || searchParams.get('tableId') || '0', 10);

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [serviceEnabled, setServiceEnabled] = useState(false);
    const [restaurantId, setRestaurantId] = useState(null);

    // Check if service requests are enabled for this restaurant
    useEffect(() => {
        const checkServiceStatus = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/public/api/v1/restaurants/1`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.content) {
                        for (const restaurant of data.content) {
                            setRestaurantId(restaurant.restId);
                            setServiceEnabled(restaurant.serviceRequestEnabled === true);
                            break;
                        }
                    } else if (data && data.restId) {
                        setRestaurantId(data.restId);
                        setServiceEnabled(data.serviceRequestEnabled === true);
                    } else {
                        setRestaurantId(1);
                        setServiceEnabled(true);
                    }
                } else {
                    setRestaurantId(1);
                    setServiceEnabled(true);
                }
            } catch (err) {
                console.warn('Could not check service request status:', err);
                setRestaurantId(1);
                setServiceEnabled(true);
            }
        };
        checkServiceStatus();
    }, [branchId]);

    if (tableNumber <= 0 || !serviceEnabled) {
        return null;
    }

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleRequest = async (requestType) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/public/api/v1/service-requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId: restaurantId,
                    branchId: parseInt(branchId, 10),
                    tableNumber: tableNumber,
                    requestType: requestType,
                }),
            });

            if (res.ok) {
                const label = requestType === 'CALL_WAITER' ? 'Waiter called' : 'Bill requested';
                showToast(`${label}! Staff will be with you shortly.`, 'success');
                setIsOpen(false);
            } else {
                const err = await res.json().catch(() => null);
                showToast(err?.message || 'Unable to send request. Please try again.', 'error');
            }
        } catch (err) {
            showToast('Network error. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toast Notification */}
            {toast && (
                <div style={{
                    ...styles.toast,
                    background: toast.type === 'error' 
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                        : 'linear-gradient(135deg, #10b981, #059669)',
                }}>
                    <span style={styles.toastIcon}>
                        {toast.type === 'error' ? '⚠️' : '✨'}
                    </span>
                    <span>{toast.message}</span>
                </div>
            )}

            {/* FAB Container */}
            <div style={styles.container}>
                {/* Expanded Action Buttons */}
                {isOpen && (
                    <div style={styles.actions}>
                        <button
                            style={{
                                ...styles.actionBtn,
                                animationDelay: '0.05s',
                                ...(isLoading && styles.actionBtnDisabled)
                            }}
                            onClick={() => handleRequest('REQUEST_BILL')}
                            disabled={isLoading}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(-5px) scale(1.05)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0) scale(1)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, #4f46e5, #4338ca)';
                            }}
                        >
                            <span style={styles.actionIcon}>💳</span>
                            <span style={styles.actionLabel}>Request Bill</span>
                            <div style={styles.actionGlow}></div>
                        </button>
                        <button
                            style={{
                                ...styles.actionBtn,
                                animationDelay: '0.1s',
                                ...(isLoading && styles.actionBtnDisabled)
                            }}
                            onClick={() => handleRequest('CALL_WAITER')}
                            disabled={isLoading}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(-5px) scale(1.05)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899, #db2777)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0) scale(1)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, #db2777, #be185d)';
                            }}
                        >
                            <span style={styles.actionIcon}>🔔</span>
                            <span style={styles.actionLabel}>Call Waiter</span>
                            <div style={styles.actionGlow}></div>
                        </button>
                    </div>
                )}

                {/* Main FAB Button */}
                <button
                    style={{
                        ...styles.fab,
                        ...(isOpen ? styles.fabOpen : {}),
                        ...(isLoading && styles.fabLoading),
                    }}
                    onClick={() => !isLoading && setIsOpen(!isOpen)}
                    aria-label="Service menu"
                    onMouseEnter={(e) => {
                        if (!isOpen && !isLoading) {
                            e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isOpen && !isLoading) {
                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                        }
                    }}
                >
                    {isLoading ? (
                        <span style={styles.fabLoader}>⏳</span>
                    ) : isOpen ? (
                        <span style={styles.fabIconText}>✕</span>
                    ) : (
                        <span style={styles.fabIconText}>🛎️</span>
                    )}
                    <div style={styles.fabRipple}></div>
                </button>

                {/* Table indicator with pulse effect */}
                <div style={styles.tableTag}>
                    <span style={styles.tableDot}>●</span>
                    Table {tableNumber}
                </div>
            </div>

            {/* Backdrop when open */}
            {isOpen && (
                <div
                    style={styles.backdrop}
                    onClick={() => setIsOpen(false)}
                />
            )}

            <style>{`
                @keyframes fabSlideIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(30px) scale(0.8); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }

                @keyframes fabPulse {
                    0%, 100% { 
                        box-shadow: 0 8px 30px rgba(245, 158, 11, 0.5),
                                    0 0 0 0 rgba(245, 158, 11, 0.7);
                    }
                    50% { 
                        box-shadow: 0 8px 40px rgba(245, 158, 11, 0.7),
                                    0 0 0 15px rgba(245, 158, 11, 0);
                    }
                }

                @keyframes fabRotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(180deg); }
                }

                @keyframes fabSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes toastSlide {
                    from { 
                        opacity: 0; 
                        transform: translate(-50%, -30px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translate(-50%, 0); 
                    }
                }

                @keyframes actionPop {
                    from { 
                        opacity: 0; 
                        transform: translateX(30px) scale(0.8); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0) scale(1); 
                    }
                }

                @keyframes dotPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.3); }
                }

                @keyframes glowPulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }

                @keyframes ripple {
                    0% {
                        transform: scale(0);
                        opacity: 0.6;
                    }
                    100% {
                        transform: scale(2.5);
                        opacity: 0;
                    }
                }

                button:active .fab-ripple {
                    animation: ripple 0.6s ease-out;
                }
            `}</style>
        </>
    );
};

// ============================================
// STYLES
// ============================================

const styles = {
    container: {
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '16px',
        animation: 'fabSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    fab: {
        width: '68px',
        height: '68px',
        borderRadius: '50%',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 30px rgba(245, 158, 11, 0.5)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        animation: 'fabPulse 2.5s ease-in-out infinite',
        position: 'relative',
        overflow: 'hidden',
    },
    fabOpen: {
        background: 'linear-gradient(135deg, #1f2937, #111827)',
        animation: 'fabRotate 0.3s ease-out',
        transform: 'rotate(180deg)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    fabLoading: {
        animation: 'fabSpin 1s linear infinite',
        cursor: 'wait',
    },
    fabIconText: {
        fontSize: '28px',
        lineHeight: 1,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    },
    fabLoader: {
        fontSize: '24px',
        animation: 'fabSpin 1s linear infinite',
    },
    fabRipple: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.3)',
        transform: 'scale(0)',
        pointerEvents: 'none',
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'flex-end',
    },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 24px',
        borderRadius: '50px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        animation: 'actionPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        whiteSpace: 'nowrap',
        position: 'relative',
        overflow: 'hidden',
    },
    actionBtnDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    actionIcon: {
        fontSize: '22px',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
    },
    actionLabel: {
        letterSpacing: '0.03em',
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    },
    actionGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
        borderRadius: '50px',
        opacity: 0.5,
        animation: 'glowPulse 2s ease-in-out infinite',
        pointerEvents: 'none',
    },
    tableTag: {
        fontSize: '12px',
        color: '#e5e7eb',
        background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))',
        padding: '6px 14px',
        borderRadius: '20px',
        textAlign: 'center',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        fontWeight: '600',
        letterSpacing: '0.05em',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    tableDot: {
        color: '#10b981',
        fontSize: '10px',
        animation: 'dotPulse 2s ease-in-out infinite',
    },
    backdrop: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(2px)',
        zIndex: 999,
        animation: 'toastSlide 0.3s ease-out',
    },
    toast: {
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '14px 28px',
        borderRadius: '16px',
        color: '#fff',
        fontSize: '15px',
        fontWeight: '600',
        zIndex: 1100,
        boxShadow: '0 10px 35px rgba(0, 0, 0, 0.4)',
        animation: 'toastSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        maxWidth: '90vw',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
    },
    toastIcon: {
        fontSize: '20px',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    },
};

export default ServiceFAB;