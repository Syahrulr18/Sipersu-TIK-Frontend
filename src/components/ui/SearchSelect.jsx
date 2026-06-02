import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

// Demo dosen grouped by status
const DOSEN_LIST = [
  { id: 10, nama_lengkap: 'Dr. Andi Pratama, M.Kom', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 11, nama_lengkap: 'Ir. Fatimah Zahra, M.T.', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 12, nama_lengkap: 'Muh. Rizky Aditya, S.Kom., M.Cs.', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 13, nama_lengkap: 'Dr. Siti Nurhaliza, M.T.', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 14, nama_lengkap: 'Ir. Budi Handoko, M.Eng.', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 15, nama_lengkap: 'Prof. Ahmad Mulyanto, Ph.D.', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 20, nama_lengkap: 'Bambang Suryanto, S.T.', jabatan: 'Dosen Honorer', status: 'Dosen Honorer' },
  { id: 21, nama_lengkap: 'Dewi Lestari, S.Kom.', jabatan: 'Dosen Honorer', status: 'Dosen Honorer' },
];

/**
 * SearchSelect — single-select dropdown with search and grouped dosen.
 * Perfect for selecting recipients (dosen) with search capability.
 * 
 * @param {string} label
 * @param {object} selected - { id: number, nama_lengkap: string }
 * @param {function} onChange - (item: object) => void
 * @param {string} error
 * @param {string} placeholder
 */
const SearchSelect = ({
  label,
  selected = null,
  onChange,
  error,
  placeholder = 'Cari Dosen...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);

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
    ? DOSEN_LIST.filter(
        (item) =>
          item.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
          item.status.toLowerCase().includes(search.toLowerCase())
      )
    : DOSEN_LIST;

  // Group filtered list by status
  const grouped = filteredList.reduce((acc, item) => {
    if (!acc[item.status]) acc[item.status] = [];
    acc[item.status].push(item);
    return acc;
  }, {});

  const handleSelect = (item) => {
    onChange(item);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearch('');
  };

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="label-field">{label}</label>
      )}
      
      {/* Trigger */}
      <div
        ref={triggerRef}
        className={`
          input-field flex items-center justify-between cursor-pointer
          ${error ? 'border-red-500 focus:ring-red-200' : ''}
          ${isOpen ? 'ring-2 ring-[#8B0000]/20 border-[#8B0000]' : ''}
        `}
        onClick={handleTriggerClick}
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected ? selected.nama_lengkap : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selected && (
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
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-w-sm">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Cari Dosen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
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
              Object.entries(grouped).map(([status, items]) => (
                <div key={status}>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">
                    {status}
                  </div>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`
                        w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors
                        ${selected?.id === item.id ? 'bg-red-50 text-[#8B0000] font-medium' : 'text-gray-700'}
                      `}
                      onClick={() => handleSelect(item)}
                    >
                      <div className="font-medium">{item.nama_lengkap}</div>
                      <div className="text-xs text-gray-400">{item.jabatan}</div>
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

export default SearchSelect;
