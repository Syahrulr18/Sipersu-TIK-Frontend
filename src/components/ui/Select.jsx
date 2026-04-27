import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Select dropdown with label and error support.
 * 
 * @param {string} label
 * @param {string} error
 * @param {Array<{value: string, label: string}>} options
 * @param {string} placeholder
 */
const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Pilih...',
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="label-field">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`
            input-field appearance-none pr-10 cursor-pointer
            ${error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
