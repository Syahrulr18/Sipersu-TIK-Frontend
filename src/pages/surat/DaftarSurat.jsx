import { useState } from 'react';
import { Search, Eye, Trash2, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

// Demo data matching mockup
const demoTerkirimSurat = [
  {
    id: 1, nomor_surat: 'M.002/9/KL.01.00/2026', tanggal: '25 Okt 2026',
    hal: 'Undangan Rapat Koordinasi',
    ringkasan: 'Dosen Pengajar Semester Ganjil',
  },
];

const DaftarSurat = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Daftar Surat</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[500px] justify-between">
        
        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-100">
            {/* Filter Button */}
            <button className="flex items-center gap-2 bg-red-50 text-[#8B0000] px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-red-100 transition-colors">
              Filter <Filter className="w-4 h-4" />
            </button>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nomor atau perihal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B0000] focus:border-[#8B0000] w-[260px] text-gray-600 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 w-16">No</th>
                  <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 w-[350px]">No. Surat / Tanggal</th>
                  <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">Hal / Perihal</th>
                  <th className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4 w-[150px] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {demoTerkirimSurat.map((surat, index) => (
                  <tr key={surat.id} className="hover:bg-gray-50/50 transition-colors group bg-white">
                    <td className="px-6 py-5 text-[13px] font-medium text-gray-600">{index + 1}</td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-[13px] text-gray-800 tracking-wide">{surat.nomor_surat}</p>
                      <p className="text-[12px] text-gray-400 mt-1 font-medium">{surat.tanggal}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-medium text-gray-700">{surat.hal}</p>
                      <p className="text-[12px] text-gray-400 mt-1">{surat.ringkasan}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          to={`/surat/${surat.id}`}
                          className="text-yellow-500 hover:text-yellow-600 transition-colors"
                          title="Detail"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          className="text-[#8B0000] hover:text-red-700 transition-colors"
                          title="Hapus"
                          onClick={() => setDeleteConfirm(surat)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => setDeleteConfirm(null)}
        title="Hapus Surat"
        message={`Yakin ingin menghapus surat ini?`}
        variant="danger"
        confirmText="Ya, Hapus"
      />
    </div>
  );
};

export default DaftarSurat;
