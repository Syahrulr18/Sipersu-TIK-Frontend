import { forwardRef } from 'react';

/**
 * Textarea component with label, error state, and character count.
 * 
 * @param {string} label
 * @param {string} error
 * @param {number} maxLength
 * @param {number} rows
 */
const Textarea = forwardRef(({
  label,
  error,
  maxLength,
  rows = 4,
  className = '',
  value,
  id,
  ...props
}, ref) => {
  const textareaId = id || props.name;
  const currentLength = value?.length || 0;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="label-field">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        value={value}
        maxLength={maxLength}
        className={`
          input-field resize-none
          ${error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      <div className="flex justify-between items-center mt-1">
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : (
          <span />
        )}
        {maxLength && (
          <span className="text-xs text-gray-400">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
