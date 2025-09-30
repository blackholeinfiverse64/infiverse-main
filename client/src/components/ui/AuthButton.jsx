import React from 'react';
import { Loader2 } from 'lucide-react';

const AuthButton = ({ 
  children, 
  loading = false, 
  disabled = false, 
  type = "button",
  onClick,
  className = "",
  ...props 
}) => {
  const handleClick = (e) => {
    console.log('AuthButton clicked!', { type, disabled, loading });
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`auth-button-primary ${loading ? 'auth-button-loading' : ''} ${className}`}
      style={{ position: 'relative', zIndex: '102' }}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {typeof children === 'string' ? 'Loading...' : children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export { AuthButton };