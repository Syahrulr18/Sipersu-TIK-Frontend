import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchMultiSelect — multi-select with search for Tujuan/Kepada field.
 * Fetches options via debounced search callback.
 * 
 * @param {string} label
 * @param {Array<{id: number, nama_lengkap: string, jabatan?: string}>} selected
 * @param {function} onChange - (selected: Array) => void
 * @param {function} onSearch - (query: string) => Promise<Array>
 * @param {string} error
 * @param {string} placeholder
 */
const SearchMultiSelect = ({
  label,
  selected = [],
  onChange,
  onSearch,
  error,
  placeholder = 'Cari Dosen...',
}) => {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  const handleSearch = useCallback(
    (value) => {
      setQuery(value);
      if (value.length < 2) {
        setOptions([]);
        setIsOpen(false);
        return;
      }

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await onSearch(value);
          // Filter out already selected
          const filtered = results.filter(
            (r) => !selected.find((s) => s.id === r.id)
          );
          setOptions(filtered);
          setIsOpen(true);
        } catch {
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [onSearch, selected]
  );

  const addItem = (item) => {
    onChange([...selected, item]);
    setQuery('');
    setOptions([]);
    setIsOpen(false);
  };

  const removeItem = (id) => {
    onChange(selected.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="label-field">{label}</label>
      )}

      {/* Selected chips */}
      <div className={`
        input-field min-h-[42px] flex flex-wrap gap-1.5 items-center
        ${error ? 'border-red-500 focus-within:ring-red-200' : 'focus-within:ring-2 focus-within:ring-[#8B0000]/20 focus-within:border-[#8B0000]'}
      `}>
        {selected.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1 bg-red-50 text-[#8B0000] px-2 py-0.5 rounded-md text-xs font-medium"
          >
            {item.nama_lengkap}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="hover:bg-red-100 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="relative flex-1 min-w-[120px]">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={selected.length === 0 ? placeholder : ''}
            className="w-full pl-5 py-0.5 text-sm border-0 focus:outline-none focus:ring-0 bg-transparent"
          />
        </div>
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto animate-slide-down">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              Mencari...
            </div>
          ) : options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              Tidak ditemukan
            </div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 transition-colors"
                onClick={() => addItem(opt)}
              >
                <div className="font-medium text-gray-800">{opt.nama_lengkap}</div>
                {opt.jabatan && (
                  <div className="text-xs text-gray-400">{opt.jabatan}</div>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default SearchMultiSelect;
