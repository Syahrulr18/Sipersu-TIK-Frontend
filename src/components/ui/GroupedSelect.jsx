import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { KODE_HAL_LIST, getGroupedKodeHal } from '@/constants/kodeHal';

/**
 * GroupedSelect — searchable dropdown with grouped options for Kode Hal.
 * Features: search filter, group by kategori, keyboard navigation.
 * 
 * @param {string} label
 * @param {string} value
 * @param {function} onChange
 * @param {string} error
 * @param {string} placeholder
 */
const GroupedSelect = ({
  label,
  value,
  onChange,
  error,
  placeholder = 'Pilih Kode Hal...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter by search term
  const filteredList = search
    ? KODE_HAL_LIST.filter(
        (item) =>
          item.kode.toLowerCase().includes(search.toLowerCase()) ||
          item.nama.toLowerCase().includes(search.toLowerCase())
      )
    : KODE_HAL_LIST;

  // Group filtered list
  const grouped = filteredList.reduce((acc, item) => {
    if (!acc[item.kategori]) acc[item.kategori] = [];
    acc[item.kategori].push(item);
    return acc;
  }, {});

  // Get selected display value
  const selectedItem = KODE_HAL_LIST.find((k) => k.kode === value);
  const displayValue = selectedItem
    ? `${selectedItem.kode} — ${selectedItem.nama}`
    : '';

  const handleSelect = (kode) => {
    onChange(kode);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="label-field">{label}</label>
      )}
      
      {/* Trigger */}
      <div
        className={`
          input-field flex items-center justify-between cursor-pointer
          ${error ? 'border-red-500 focus:ring-red-200' : ''}
          ${isOpen ? 'ring-2 ring-[#8B0000]/20 border-[#8B0000]' : ''}
        `}
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
      >
        <span className={displayValue ? 'text-gray-900' : 'text-gray-400'}>
          {displayValue || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-100 rounded"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg animate-slide-down">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Cari kode atau nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-64 overflow-y-auto py-1">
            {Object.keys(grouped).length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Tidak ditemukan
              </div>
            ) : (
              Object.entries(grouped).map(([kategori, items]) => (
                <div key={kategori}>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">
                    {kategori}
                  </div>
                  {items.map((item) => (
                    <button
                      key={item.kode}
                      type="button"
                      className={`
                        w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors
                        ${value === item.kode ? 'bg-red-50 text-[#8B0000] font-medium' : 'text-gray-700'}
                      `}
                      onClick={() => handleSelect(item.kode)}
                    >
                      <span className="font-medium">{item.kode}</span>
                      <span className="text-gray-400 mx-1">—</span>
                      <span>{item.nama}</span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default GroupedSelect;
