// src/components/ui/index.jsx - Complete UI Components
import {
    X,
    Loader2,
    AlertCircle,
    Search,
    Filter,
    Eye,
    Plus
} from 'lucide-react';

// ===================
// BUTTON COMPONENT
// ===================

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    loading = false,
    disabled = false,
    className = '',
    ...props
}) => {
    let buttonClass = 'btn';

    // Variants
    if (variant === 'primary') buttonClass += ' btn-primary';
    else if (variant === 'secondary') buttonClass += ' btn-secondary';
    else if (variant === 'outline') buttonClass += ' btn-outline';
    else if (variant === 'ghost') buttonClass += ' btn-ghost';
    else if (variant === 'danger') buttonClass += ' btn-danger';

    // Sizes
    if (size === 'sm') buttonClass += ' btn-sm';
    else if (size === 'lg') buttonClass += ' btn-lg';

    // States
    if (loading || disabled) buttonClass += ' btn-disabled';

    if (className) buttonClass += ' ' + className;

    return (
        <button
            className={buttonClass}
            disabled={loading || disabled}
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
// ACTION BUTTON
// ===================

export const ActionButton = ({ children, variant = 'ghost', size = 'sm', ...props }) => (
    <Button variant={variant} size={size} {...props}>
        {children}
    </Button>
);

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
                <p className="form-helper">
                    {helperText}
                </p>
            )}
        </div>
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
    className = ''
}) => {
    let inputClass = 'search-input';
    if (className) inputClass += ' ' + className;

    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className={inputClass}
                />
                {value && onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="search-clear"
                    >
                        <X className="search-clear-icon" />
                    </button>
                )}
            </div>
        </div>
    );
};

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

    return (
        <div className={alertClass}>
            <div className="alert-content">
                {title && (
                    <div className="alert-title">
                        {title}
                    </div>
                )}
                <div className="alert-body">
                    {children}
                </div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="alert-close"
                >
                    <X className="alert-close-icon" />
                </button>
            )}
        </div>
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
    let emptyClass = 'empty-state';
    if (className) emptyClass += ' ' + className;

    return (
        <div className={emptyClass}>
            {Icon && (
                <div className="empty-state-icon">
                    <Icon className="empty-icon" />
                </div>
            )}
            <h3 className="empty-state-title">
                {title}
            </h3>
            <p className="empty-state-description">
                {description}
            </p>
            {action && (
                <div className="empty-state-action">
                    {action}
                </div>
            )}
        </div>
    );
};

// ===================
// MODAL COMPONENT
// ===================

export const Modal = ({
    children,
    title,
    isOpen,
    onClose,
    size = 'md',
    showCloseButton = true,
    className = ''
}) => {
    if (!isOpen) return null;

    let modalClass = 'modal';
    if (size === 'sm') modalClass += ' modal-sm';
    else if (size === 'lg') modalClass += ' modal-lg';
    else if (size === 'xl') modalClass += ' modal-xl';

    let contentClass = 'modal-content';
    if (className) contentClass += ' ' + className;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={contentClass} onClick={(e) => e.stopPropagation()}>
                <div className={modalClass}>
                    {(title || showCloseButton) && (
                        <div className="modal-header">
                            {title && (
                                <h3 className="modal-title">
                                    {title}
                                </h3>
                            )}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="modal-close-button"
                                >
                                    <X className="modal-close-icon" />
                                </button>
                            )}
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
// FILTER COMPONENT
// ===================

export const FilterButton = ({ children, active = false, onClick, className = '' }) => {
    let filterClass = 'filter-button';
    if (active) filterClass += ' filter-button-active';
    if (className) filterClass += ' ' + className;

    return (
        <button
            onClick={onClick}
            className={filterClass}
        >
            <Filter className="filter-icon" />
            {children}
        </button>
    );
};