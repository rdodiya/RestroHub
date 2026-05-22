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
    const tableNumber = parseInt(searchParams.get('table') || '0', 10);

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cooldown, setCooldown] = useState(false);
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
                    // Find the restaurant that has this branch
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
                        // Fallback for UI demo testing
                        setRestaurantId(1);
                        setServiceEnabled(true);
                    }
                } else {
                    // Fallback for UI demo testing if endpoint returns 404/500
                    setRestaurantId(1);
                    setServiceEnabled(true);
                }
            } catch (err) {
                console.warn('Could not check service request status:', err);
                // Fallback for UI demo testing
                setRestaurantId(1);
                setServiceEnabled(true);
            }
        };
        checkServiceStatus();
    }, [branchId]);

    // Don't render for Table 0 (counter QR) or if feature is disabled
    if (tableNumber <= 0 || !serviceEnabled) {
        return null;
    }

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleRequest = async (requestType) => {
        if (cooldown || isLoading) return;

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
                showToast(`✅ ${label}! Staff will be with you shortly.`);
                setCooldown(true);
                setIsOpen(false);
                setTimeout(() => setCooldown(false), 30000);
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
                    background: toast.type === 'error' ? '#ef4444' : '#10b981',
                }}>
                    {toast.message}
                </div>
            )}

            {/* FAB Container */}
            <div style={styles.container}>
                {/* Expanded Action Buttons */}
                {isOpen && (
                    <div style={styles.actions}>
                        <button
                            style={styles.actionBtn}
                            onClick={() => handleRequest('REQUEST_BILL')}
                            disabled={isLoading}
                        >
                            <span style={styles.actionIcon}>💳</span>
                            <span style={styles.actionLabel}>Request Bill</span>
                        </button>
                        <button
                            style={styles.actionBtn}
                            onClick={() => handleRequest('CALL_WAITER')}
                            disabled={isLoading}
                        >
                            <span style={styles.actionIcon}>🔔</span>
                            <span style={styles.actionLabel}>Call Waiter</span>
                        </button>
                    </div>
                )}

                {/* Main FAB Button */}
                <button
                    style={{
                        ...styles.fab,
                        ...(cooldown ? styles.fabCooldown : {}),
                        ...(isOpen ? styles.fabOpen : {}),
                    }}
                    onClick={() => !cooldown && setIsOpen(!isOpen)}
                    disabled={cooldown}
                    aria-label="Service menu"
                >
                    {cooldown ? (
                        <span style={styles.fabIconText}>✓</span>
                    ) : isOpen ? (
                        <span style={styles.fabIconText}>✕</span>
                    ) : (
                        <span style={styles.fabIconText}>🛎️</span>
                    )}
                </button>

                {/* Table indicator */}
                <div style={styles.tableTag}>
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
                    from { opacity: 0; transform: translateY(20px) scale(0.8); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes fabPulse {
                    0%, 100% { box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4); }
                    50% { box-shadow: 0 4px 30px rgba(245, 158, 11, 0.7); }
                }
                @keyframes toastSlide {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes actionPop {
                    from { opacity: 0; transform: scale(0.5) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
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
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        animation: 'fabSlideIn 0.4s ease-out',
    },
    fab: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
        transition: 'all 0.3s ease',
        animation: 'fabPulse 2s ease-in-out infinite',
    },
    fabOpen: {
        background: 'linear-gradient(135deg, #374151, #1f2937)',
        animation: 'none',
        transform: 'rotate(0deg)',
    },
    fabCooldown: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        animation: 'none',
        cursor: 'default',
    },
    fabIconText: {
        fontSize: '24px',
        lineHeight: 1,
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'flex-end',
    },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 20px',
        borderRadius: '50px',
        border: 'none',
        background: '#1f2937',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s ease',
        animation: 'actionPop 0.3s ease-out',
        whiteSpace: 'nowrap',
    },
    actionIcon: {
        fontSize: '18px',
    },
    actionLabel: {
        letterSpacing: '0.02em',
    },
    tableTag: {
        fontSize: '11px',
        color: '#9ca3af',
        background: 'rgba(31, 41, 55, 0.8)',
        padding: '4px 10px',
        borderRadius: '12px',
        textAlign: 'center',
        backdropFilter: 'blur(8px)',
    },
    backdrop: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        zIndex: 999,
    },
    toast: {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        borderRadius: '12px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        zIndex: 1100,
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
        animation: 'toastSlide 0.3s ease-out',
        maxWidth: '90vw',
        textAlign: 'center',
    },
};

export default ServiceFAB;
