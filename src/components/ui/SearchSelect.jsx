import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown, X, Loader2 } from 'lucide-react';
import { searchDosen } from '@/api/master.api';

const SearchSelect = ({
  label,
  selected = null,
  onChange,
  error,
  placeholder = 'Cari Dosen...',
  isMulti = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dosenList, setDosenList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDosen = useCallback((keyword) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await searchDosen(keyword);
        setDosenList(res.data?.data || []);
      } catch {
        setDosenList([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchDosen(search);
    }
  }, [isOpen, search, fetchDosen]);

  const grouped = dosenList.reduce((acc, item) => {
    const group = item.jabatan || 'Dosen';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  const handleSelect = (item) => {
    if (isMulti) {
      const currentSelected = Array.isArray(selected) ? selected : [];
      const exists = currentSelected.find((s) => s.id === item.id);
      if (exists) {
        onChange(currentSelected.filter((s) => s.id !== item.id));
      } else {
        onChange([...currentSelected, item]);
      }
    } else {
      onChange(item);
      setIsOpen(false);
    }
    setSearch('');
  };

  const handleRemoveItem = (e, itemToRemove) => {
    e.stopPropagation();
    if (isMulti) {
      onChange((selected || []).filter((s) => s.id !== itemToRemove.id));
    } else {
      onChange(null);
      setSearch('');
    }
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    onChange(isMulti ? [] : null);
    setSearch('');
  };

  const renderSelectedText = () => {
    if (isMulti) {
      if (!selected || selected.length === 0) return <span className="text-gray-400">{placeholder}</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {selected.map((item) => (
            <span key={item.id} className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
              {item.nama_lengkap}
              <button type="button" onClick={(e) => handleRemoveItem(e, item)} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      );
    }
    return <span className={selected ? 'text-gray-900' : 'text-gray-400'}>{selected ? selected.nama_lengkap : placeholder}</span>;
  };

  const hasSelection = isMulti ? selected?.length > 0 : !!selected;

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && <label className="label-field">{label}</label>}
      <div
        className={`input-field flex items-center justify-between cursor-pointer min-h-[42px] ${error ? 'border-red-500 focus:ring-red-200' : ''} ${isOpen ? 'ring-2 ring-[#8B0000]/20 border-[#8B0000]' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          } else {
            setIsOpen(false);
          }
        }}
      >
        <div className="flex-1 mr-2">{renderSelectedText()}</div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {hasSelection && (
            <button type="button" onClick={handleClearAll} className="p-0.5 hover:bg-gray-100 rounded">
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Cari Dosen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000]"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Memuat...
              </div>
            ) : Object.keys(grouped).length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">{search ? 'Dosen tidak ditemukan' : 'Tidak ada data dosen'}</div>
            ) : (
              Object.entries(grouped).map(([jabatan, items]) => (
                <div key={jabatan}>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">{jabatan}</div>
                  {items.map((item) => {
                    const isSelected = isMulti ? (selected || []).find((s) => s.id === item.id) : selected?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors ${isSelected ? 'bg-red-50 text-[#8B0000] font-medium' : 'text-gray-700'}`}
                        onClick={() => handleSelect(item)}
                      >
                        <div className="font-medium">{item.nama_lengkap}</div>
                        <div className="text-xs text-gray-400">{item.jabatan} • {item.nip || 'NIP: -'}</div>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SearchSelect;
