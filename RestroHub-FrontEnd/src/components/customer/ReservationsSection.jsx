import React, { useState } from 'react';
import { useSiteData } from '@context/SiteContext';
import ApiService from '@services/public/ApiService';

// ============================================
// RESERVATIONS SECTION COMPONENT
// Booking form with validation
// ============================================

const ReservationsSection = () => {
    const { siteData } = useSiteData();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
        requests: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [confirmationNumber, setConfirmationNumber] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    if (!siteData) return null;

    const { reservations } = siteData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setFieldErrors({});

        // Client-side validation
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Enter a valid email address';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone)) errors.phone = 'Enter a valid phone number';
        if (!formData.date) errors.date = 'Select a date';
        else if (new Date(formData.date) < new Date(getMinDate())) errors.date = 'Date cannot be in the past';
        if (!formData.time) errors.time = 'Select a time slot';
        if (!formData.guests) errors.guests = 'Select number of guests';

        if (Object.keys(errors).length) {
            setFieldErrors(errors);
            setError('Please fix the highlighted fields and try again.');
            setSubmitting(false);
            return;
        }

        try {
            const response = await ApiService.submitReservation(formData);
            
            if (response.success) {
                setSubmitted(true);
                setConfirmationNumber(response.confirmationNumber);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '',
                    guests: '',
                    requests: ''
                });
                setFieldErrors({});
            }
        } catch (err) {
            setError('Failed to submit reservation. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setConfirmationNumber(null);
    };

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <section id="pricing" className="reservations section">
            {/* Background Image */}
            <div 
                className="reservations-bg"
                style={{ backgroundImage: `url('${reservations.backgroundImage}')` }}
            />

            <div className="container reservations-container">
                {/* Header */}
                <div className="reservations-header">
                    <p className="section-subtitle">{reservations.subtitle}</p>
                    <h2 className="section-title font-heading">{reservations.title}</h2>
                    <p className="reservations-description">{reservations.description}</p>
                </div>

                {/* Success Message */}
                {submitted ? (
                    <div className="reservations-success fade-in">
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                <path d="M22 4L12 14.01l-3-3" />
                            </svg>
                        </div>
                        <h3 className="success-title font-heading">Thank You!</h3>
                        <p className="success-message">
                            Your reservation request has been received. We'll contact you shortly to confirm.
                        </p>
                        {confirmationNumber && (
                            <p className="success-confirmation">
                                Confirmation #: <strong>{confirmationNumber}</strong>
                            </p>
                        )}
                        <button 
                            onClick={handleReset}
                            className="btn btn-outline"
                        >
                            Make Another Reservation
                        </button>
                    </div>
                ) : (
                    /* Reservation Form */
                    <form onSubmit={handleSubmit} className="reservations-form">
                        {error && (
                            <div className="form-error">
                                {error}
                            </div>
                        )}

                        <div className="form-row">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name *"
                                    aria-required="true"
                                    aria-invalid={fieldErrors.name ? "true" : "false"}
                                    aria-describedby={fieldErrors.name ? "err-name" : undefined}
                                    className={`${fieldErrors.name ? 'border-red-500' : ''} input`}
                                />
                                {fieldErrors.name && (
                                    <p id="err-name" className="mt-1.5 text-xs text-red-500">{fieldErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email Address *"
                                    aria-required="true"
                                    aria-invalid={fieldErrors.email ? "true" : "false"}
                                    aria-describedby={fieldErrors.email ? "err-email" : undefined}
                                    className={`${fieldErrors.email ? 'border-red-500' : ''} input`}
                                />
                                {fieldErrors.email && (
                                    <p id="err-email" className="mt-1.5 text-xs text-red-500">{fieldErrors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number *"
                                    aria-required="true"
                                    aria-invalid={fieldErrors.phone ? "true" : "false"}
                                    aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
                                    className={`${fieldErrors.phone ? 'border-red-500' : ''} input`}
                                />
                                {fieldErrors.phone && (
                                    <p id="err-phone" className="mt-1.5 text-xs text-red-500">{fieldErrors.phone}</p>
                                )}
                            </div>
                        </div>

                        <div className="form-row form-row-3">
                            <div>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={getMinDate()}
                                    aria-required="true"
                                    aria-invalid={fieldErrors.date ? "true" : "false"}
                                    aria-describedby={fieldErrors.date ? "err-date" : undefined}
                                    className={`${fieldErrors.date ? 'border-red-500' : ''} input`}
                                />
                                {fieldErrors.date && (
                                    <p id="err-date" className="mt-1.5 text-xs text-red-500">{fieldErrors.date}</p>
                                )}
                            </div>

                            <div>
                                <select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    aria-required="true"
                                    aria-invalid={fieldErrors.time ? "true" : "false"}
                                    aria-describedby={fieldErrors.time ? "err-time" : undefined}
                                    className={`${fieldErrors.time ? 'border-red-500' : ''} input`}
                                >
                                    <option value="">Select Time *</option>
                                    {reservations.timeSlots.map((time, index) => (
                                        <option key={index} value={time}>{time}</option>
                                    ))}
                                </select>
                                {fieldErrors.time && (
                                    <p id="err-time" className="mt-1.5 text-xs text-red-500">{fieldErrors.time}</p>
                                )}
                            </div>

                            <div>
                                <select
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                    aria-required="true"
                                    aria-invalid={fieldErrors.guests ? "true" : "false"}
                                    aria-describedby={fieldErrors.guests ? "err-guests" : undefined}
                                    className={`${fieldErrors.guests ? 'border-red-500' : ''} input`}
                                >
                                    <option value="">Guests *</option>
                                    {reservations.guestOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                                {fieldErrors.guests && (
                                    <p id="err-guests" className="mt-1.5 text-xs text-red-500">{fieldErrors.guests}</p>
                                )}
                            </div>
                        </div>

                        <textarea
                            name="requests"
                            value={formData.requests}
                            onChange={handleChange}
                            placeholder="Special Requests (allergies, celebrations, seating preferences...)"
                            rows="4"
                            className="input"
                        />

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary reservations-submit"
                        >
                            {submitting ? (
                                <>
                                    <span className="btn-loader"></span>
                                    Processing...
                                </>
                            ) : (
                                'Reserve Now'
                            )}
                        </button>
                    </form>
                )}
            </div>

            <style>{`
                .reservations {
                    position: relative;
                    background-color: var(--color-bg-primary);
                    overflow: hidden;
                }

                .reservations-bg {
                    position: absolute;
                    inset: 0;
                    background-size: cover;
                    background-position: center;
                    opacity: 0.18;
                    pointer-events: none;
                }

                .reservations-container {
                    position: relative;
                    z-index: 1;
                    max-width: 800px;
                }

                .reservations-header {
                    text-align: center;
                    margin-bottom: var(--spacing-xl);
                }

                @media (min-width: 768px) {
                    .reservations-header {
                        margin-bottom: var(--spacing-2xl);
                    }
                }

                .reservations-description {
                    margin-top: var(--spacing-md);
                    color: var(--color-text-secondary);
                    line-height: 1.8;
                }

                .reservations-form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                    background: var(--color-bg-primary);
                    border: 1px solid var(--color-border-primary);
                    padding: var(--spacing-xl);
                }

                @media (min-width: 768px) {
                    .reservations-form {
                        gap: var(--spacing-lg);
                        padding: var(--spacing-2xl);
                    }
                }

                .form-row {
                    display: grid;
                    gap: var(--spacing-md);
                }

                @media (min-width: 768px) {
                    .form-row {
                        grid-template-columns: repeat(2, 1fr);
                        gap: var(--spacing-lg);
                    }

                    .form-row-3 {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                .form-error {
                    padding: var(--spacing-md);
                    text-align: center;
                    color: var(--color-primary);
                    background: color-mix(in srgb, var(--color-primary) 12%, transparent);
                    border: 1px solid var(--color-primary);
                    border-radius: var(--radius-sm);
                }

                textarea.input {
                    resize: vertical;
                    min-height: 140px;
                }

                .reservations-submit {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-sm);
                }

                .reservations-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-loader {
                    width: 16px;
                    height: 16px;
                    border: 2px solid transparent;
                    border-top-color: currentColor;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* ============================= */
                /* Success State */
                /* ============================= */

                .reservations-success {
                    text-align: center;
                    background: var(--color-bg-primary);
                    border: 1px solid var(--color-primary);
                    padding: var(--spacing-2xl);
                }

                @media (min-width: 768px) {
                    .reservations-success {
                        padding: var(--spacing-3xl);
                    }
                }

                .success-icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto var(--spacing-lg);
                    color: var(--color-primary);
                }

                .success-icon svg {
                    width: 100%;
                    height: 100%;
                }

                .success-title {
                    font-size: var(--text-2xl);
                    color: var(--color-primary);
                    margin-bottom: var(--spacing-md);
                }

                @media (min-width: 768px) {
                    .success-title {
                        font-size: var(--text-3xl);
                    }
                }

                .success-message {
                    color: var(--color-text-secondary);
                    line-height: 1.8;
                    margin-bottom: var(--spacing-md);
                }

                .success-confirmation {
                    color: var(--color-text-secondary);
                    margin-bottom: var(--spacing-xl);
                }

                .success-confirmation strong {
                    color: var(--color-text-primary);
                }
            `}</style>
        </section>
    );
};

export default ReservationsSection;
