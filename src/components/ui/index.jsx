// src/components/ui/index.jsx - Complete UI Components Library
// Replace your ENTIRE src/components/ui/index.jsx with this content

import { useState, useEffect } from 'react';
import {
    Check,
    X,
    ChevronDown,
    Search,
    Plus,
    Trash2,
    Edit,
    Eye,
    AlertCircle,
    CheckCircle,
    Info,
    XCircle,
    Loader2
} from 'lucide-react';

// ===================
// BUTTON COMPONENTS
// ===================

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon: Icon,
    className = '',
    ...props
}) => {
    let buttonClass = 'btn';

    // Add variant classes
    if (variant === 'primary') buttonClass += ' btn-primary';
    else if (variant === 'secondary') buttonClass += ' btn-secondary';
    else if (variant === 'outline') buttonClass += ' btn-outline';
    else if (variant === 'ghost') buttonClass += ' btn-ghost';
    else if (variant === 'danger') buttonClass += ' btn-danger';

    // Add size classes
    if (size === 'sm') buttonClass += ' btn-sm';
    else if (size === 'lg') buttonClass += ' btn-lg';

    // Add disabled class
    if (disabled || loading) buttonClass += ' btn-disabled';

    // Add custom className
    if (className) buttonClass += ' ' + className;

    return (
        <button
            className={buttonClass}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="btn-icon spin-animation" />
                    {children}
                </>
            ) : Icon ? (
                <>
                    <Icon className="btn-icon" />
                    {children}
                </>
            ) : (
                children
            )}
        </button>
    );
};

// ===================
// CARD COMPONENTS
// ===================

export const Card = ({ children, className = '', hover = true, ...props }) => {
    let cardClass = 'card';
    if (hover) cardClass += ' card-hover';
    if (className) cardClass += ' ' + className;

    return (
        <div className={cardClass} {...props}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
    <div className={`card-header ${className}`}>
        {children}
    </div>
);

export const CardContent = ({ children, className = '' }) => (
    <div className={`card-content ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`card-footer ${className}`}>
        {children}
    </div>
);

// ===================
// INPUT COMPONENTS
// ===================

export const Input = ({
    label,
    error,
    helperText,
    icon: Icon,
    className = '',
    required = false,
    ...props
}) => {
    let inputClass = 'form-input';
    if (error) inputClass += ' form-input-error';
    if (Icon) inputClass += ' form-input-with-icon';
    if (className) inputClass += ' ' + className;

    return (
        <div className="form-field">
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="form-required">*</span>}
                </label>
            )}
            <div className="form-input-container">
                {Icon && (
                    <div className="form-input-icon">
                        <Icon className="form-icon" />
                    </div>
                )}
                <input className={inputClass} {...props} />
            </div>
            {error && (
                <p className="form-error">
                    <AlertCircle className="form-error-icon" />
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="form-helper">{helperText}</p>
            )}
        </div>
    );
};

export const Textarea = ({
    label,
    error,
    helperText,
    className = '',
    required = false,
    rows = 4,
    ...props
}) => {
    let textareaClass = 'form-textarea';
    if (error) textareaClass += ' form-input-error';
    if (className) textareaClass += ' ' + className;

    return (
        <div className="form-field">
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="form-required">*</span>}
                </label>
            )}
            <textarea
                className={textareaClass}
                rows={rows}
                {...props}
            />
            {error && (
                <p className="form-error">
                    <AlertCircle className="form-error-icon" />
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="form-helper">{helperText}</p>
            )}
        </div>
    );
};

export const Select = ({
    label,
    error,
    helperText,
    options = [],
    placeholder = 'Select an option',
    className = '',
    required = false,
    ...props
}) => {
    let selectClass = 'form-select';
    if (error) selectClass += ' form-input-error';
    if (className) selectClass += ' ' + className;

    return (
        <div className="form-field">
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="form-required">*</span>}
                </label>
            )}
            <div className="form-select-container">
                <select className={selectClass} {...props}>
                    <option value="">{placeholder}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="form-select-icon">
                    <ChevronDown className="form-icon" />
                </div>
            </div>
            {error && (
                <p className="form-error">
                    <AlertCircle className="form-error-icon" />
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="form-helper">{helperText}</p>
            )}
        </div>
    );
};

// ===================
// CHECKBOX & RADIO
// ===================

export const Checkbox = ({
    label,
    description,
    checked = false,
    onChange,
    className = '',
    ...props
}) => {
    return (
        <div className={`form-checkbox ${className}`}>
            <div className="form-checkbox-input-wrapper">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="form-checkbox-input"
                    {...props}
                />
            </div>
            {label && (
                <div className="form-checkbox-content">
                    <label className="form-checkbox-label">
                        {label}
                    </label>
                    {description && (
                        <p className="form-checkbox-description">{description}</p>
                    )}
                </div>
            )}
        </div>
    );
};

// ===================
// ALERT COMPONENT
// ===================

export const Alert = ({
    children,
    variant = 'info',
    title,
    onClose,
    className = ''
}) => {
    let alertClass = 'alert';

    if (variant === 'info') alertClass += ' alert-info';
    else if (variant === 'success') alertClass += ' alert-success';
    else if (variant === 'warning') alertClass += ' alert-warning';
    else if (variant === 'error') alertClass += ' alert-error';

    if (className) alertClass += ' ' + className;

    const getIcon = () => {
        switch (variant) {
            case 'success': return CheckCircle;
            case 'warning': return AlertCircle;
            case 'error': return XCircle;
            default: return Info;
        }
    };

    const Icon = getIcon();

    return (
        <div className={alertClass}>
            <div className="alert-content">
                <div className="alert-icon">
                    <Icon className="alert-icon-svg" />
                </div>
                <div className="alert-body">
                    {title && (
                        <h3 className="alert-title">
                            {title}
                        </h3>
                    )}
                    <div className="alert-message">
                        {children}
                    </div>
                </div>
                {onClose && (
                    <div className="alert-close">
                        <button
                            onClick={onClose}
                            className="alert-close-button"
                        >
                            <X className="alert-close-icon" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ===================
// MODAL COMPONENT
// ===================

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    className = ''
}) => {
    let modalClass = 'modal-content';

    if (size === 'sm') modalClass += ' modal-sm';
    else if (size === 'lg') modalClass += ' modal-lg';
    else if (size === 'xl') modalClass += ' modal-xl';

    if (className) modalClass += ' ' + className;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div
                    className="modal-backdrop"
                    onClick={onClose}
                />

                <div className={modalClass}>
                    {title && (
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="modal-close-button"
                            >
                                <X className="modal-close-icon" />
                            </button>
                        </div>
                    )}
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===================
// LOADING COMPONENTS
// ===================

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    let spinnerClass = 'loading-spinner';

    if (size === 'sm') spinnerClass += ' loading-spinner-sm';
    else if (size === 'lg') spinnerClass += ' loading-spinner-lg';

    if (className) spinnerClass += ' ' + className;

    return (
        <Loader2 className={spinnerClass} />
    );
};

export const LoadingCard = () => (
    <Card className="loading-card">
        <CardContent>
            <div className="loading-content">
                <div className="loading-line loading-line-1"></div>
                <div className="loading-line loading-line-2"></div>
                <div className="loading-line loading-line-3"></div>
            </div>
        </CardContent>
    </Card>
);

// ===================
// BADGE COMPONENT
// ===================

export const Badge = ({
    children,
    variant = 'default',
    size = 'sm',
    className = ''
}) => {
    let badgeClass = 'badge';

    if (variant === 'default') badgeClass += ' badge-default';
    else if (variant === 'primary') badgeClass += ' badge-primary';
    else if (variant === 'success') badgeClass += ' badge-success';
    else if (variant === 'warning') badgeClass += ' badge-warning';
    else if (variant === 'error') badgeClass += ' badge-error';
    else if (variant === 'outline') badgeClass += ' badge-outline';

    if (size === 'md') badgeClass += ' badge-md';

    if (className) badgeClass += ' ' + className;

    return (
        <span className={badgeClass}>
            {children}
        </span>
    );
};

// ===================
// SEARCH INPUT
// ===================

export const SearchInput = ({
    placeholder = 'Search...',
    value = '',
    onChange,
    onClear,
    className = '',
    ...props
}) => {
    return (
        <div className={`search-input ${className}`}>
            <div className="search-input-icon">
                <Search className="form-icon" />
            </div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="search-input-field"
                {...props}
            />
            {value && onClear && (
                <button
                    onClick={onClear}
                    className="search-input-clear"
                >
                    <X className="form-icon" />
                </button>
            )}
        </div>
    );
};

// ===================
// ACTION BUTTONS
// ===================

export const ActionButton = ({
    icon: Icon,
    onClick,
    variant = 'ghost',
    size = 'sm',
    tooltip,
    className = '',
    ...props
}) => {
    let buttonClass = 'action-button';

    if (variant === 'danger') buttonClass += ' action-button-danger';
    if (size === 'md') buttonClass += ' action-button-md';
    if (className) buttonClass += ' ' + className;

    return (
        <button
            onClick={onClick}
            className={buttonClass}
            title={tooltip}
            {...props}
        >
            <Icon className="action-button-icon" />
        </button>
    );
};

// ===================
// EMPTY STATE
// ===================

export const EmptyState = ({
    title,
    description,
    action,
    icon: Icon,
    className = ''
}) => {
    return (
        <div className={`empty-state ${className}`}>
            {Icon && (
                <div className="empty-state-icon">
                    <Icon className="empty-state-icon-svg" />
                </div>
            )}
            <h3 className="empty-state-title">
                {title}
            </h3>
            {description && (
                <p className="empty-state-description">
                    {description}
                </p>
            )}
            {action && (
                <div className="empty-state-action">
                    {action}
                </div>
            )}
        </div>
    );
};