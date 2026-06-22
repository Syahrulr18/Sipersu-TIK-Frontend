import { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import SearchSelect from '@/components/ui/SearchSelect';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { getPenandaTangan, getVerifikator } from '@/api/master.api';

/**
 * ModalUploadWordSurat — Upload file Word (.docx) dan extract data
 * Frontend only - Extract basic information dari file
 */
// Demo dosen list (for manual tujuan selection)
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

const ModalUploadWordSurat = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedTujuan, setSelectedTujuan] = useState([]);
  const [selectedPenandaTangan, setSelectedPenandaTangan] = useState('');
  const [selectedVerifikator, setSelectedVerifikator] = useState('');

  // Fetch penanda tangan dari API
  const { data: penandaTanganData } = useQuery({
    queryKey: ['penanda-tangan'],
    queryFn: () => getPenandaTangan().then((r) => r.data?.data || []),
    enabled: isOpen,
  });

  // Fetch verifikator dari API
  const { data: verifikatorData } = useQuery({
    queryKey: ['verifikator'],
    queryFn: () => getVerifikator().then((r) => r.data?.data || []),
    enabled: isOpen,
  });

  const penandaTanganOptions = (penandaTanganData || []).map((u) => ({
    value: String(u.id),
    label: `${u.nama_lengkap}${u.jabatan ? ` — ${u.jabatan}` : ''}`,
  }));

  const verifikatorOptions = (verifikatorData || []).map((u) => ({
    value: String(u.id),
    label: `${u.nama_lengkap}${u.jabatan ? ` — ${u.jabatan}` : ''}`,
  }));

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file type
    if (!file.name.endsWith('.docx')) {
      toast.error('Hanya file .docx yang didukung');
      return;
    }

    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setSelectedFile(file);
    setFilePreview({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: 'Word Document',
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Pilih file Word terlebih dahulu');
      return;
    }

    try {
      setIsLoading(true);

      // Baca file sebagai ArrayBuffer
      const arrayBuffer = await selectedFile.arrayBuffer();

      // Import mammoth secara dinamis (pastikan library sudah di-install)
      // npm install mammoth
      const mammoth = (await import('mammoth')).default;

      // Extract text dari Word document
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      // Extract data dari text
      const extractedData = extractDataFromText(text);

      // Override tujuan jika user sudah memilih dari dropdown
      if (selectedTujuan && selectedTujuan.length > 0) {
        extractedData.tujuan_dosen_list = selectedTujuan;
      }

      // Masukkan penandatangan, verifikator
      if (selectedPenandaTangan) extractedData.penanda_tangan_id = selectedPenandaTangan;
      if (selectedVerifikator) extractedData.verifikator_id = selectedVerifikator;

      // Panggil callback dengan data yang diextract
      onUpload(extractedData);
      toast.success('File berhasil diupload dan diparse');
      handleReset();
      onClose();
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Gagal memproses file Word. Pastikan library mammoth sudah di-install: npm install mammoth');
    } finally {
      setIsLoading(false);
    }
  };

  const extractDataFromText = (text) => {
    const lines = text.split('\n').filter(l => l.trim());

    let hal = '';
    let ringkasan = '';
    let kode_hal = '';

    // === FASE 1: Cari metadata (Nomor, Perihal, Kepada) ===
    let perihalIndex = -1;
    let kepadaIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase().trim();

      // Cari nomor surat untuk kode hal (contoh: M.002/9/KL.01.00/2026)
      if (lowerLine.match(/^nomor\s*:/) || lowerLine.match(/^no\.\s*:/)) {
        const kodeHalMatch = line.match(/([A-Z]{2}\.\d{2}\.\d{2})/i);
        if (kodeHalMatch) {
          kode_hal = kodeHalMatch[1].toUpperCase();
        }
      }

      // Cari perihal/hal
      if (lowerLine.match(/^(?:perihal|hal)\s*:/)) {
        hal = line.replace(/^(?:perihal|hal)\s*:/i, '').trim();
        perihalIndex = i;
      }

      // Cari kepada
      if (lowerLine.match(/^kepada\s/) || lowerLine === 'kepada yth.' || lowerLine === 'kepada yth') {
        kepadaIndex = i;
      }
    }

    // === FASE 2: Tentukan awal isi surat (setelah blok alamat) ===
    // Blok alamat biasanya setelah "Kepada Yth." sampai "Di- Tempat"
    let bodyStartIndex = Math.max(perihalIndex, kepadaIndex) + 1;

    // Cari akhir blok alamat (baris "Di-  Tempat" atau sejenisnya)
    for (let i = bodyStartIndex; i < lines.length; i++) {
      const l = lines[i].toLowerCase().trim();
      if (l === 'tempat' || l === 'di- tempat' || l === 'di -  tempat' || l === 'di-') {
        bodyStartIndex = i + 1;
        break;
      }
      // Jika sudah menemukan kalimat panjang (paragraf), ini sudah body
      if (l.length > 50 && !l.includes('yth') && !l.includes('politeknik') && !l.includes('jurusan')) {
        bodyStartIndex = i;
        break;
      }
    }

    // === FASE 3: Tentukan akhir isi surat (sebelum tanda tangan) ===
    let bodyEndIndex = lines.length;
    for (let i = bodyStartIndex; i < lines.length; i++) {
      const l = lines[i].toLowerCase().trim();
      // Deteksi blok tanda tangan / penutup jabatan
      if (
        l.match(/^(ketua jurusan|kepala|dekan|direktur|rektor|sekretaris|koordinator)/i) ||
        l.match(/^(hormat kami|yang membuat|mengetahui)/i) ||
        l.match(/^nip[\s.:]/i) ||
        l.match(/^\d{18,}/) // NIP panjang
      ) {
        bodyEndIndex = i;
        break;
      }
    }

    // === FASE 4: Ambil semua baris body sebagai ringkasan ===
    const bodyLines = lines.slice(bodyStartIndex, bodyEndIndex)
      .map(l => l.trim())
      .filter(l => {
        const lower = l.toLowerCase();
        // Filter baris kosong pendek dan sisa header
        return l.length > 0 &&
          !lower.includes('yth') &&
          !lower.startsWith('kepada') &&
          !lower.includes('politeknik negeri') &&
          lower !== 'di-' &&
          lower !== 'tempat' &&
          lower !== 'di - tempat' &&
          lower !== 'di-  tempat';
      });

    ringkasan = bodyLines.join('\n').trim();

    return {
      hal: hal || '',
      ringkasan: ringkasan || '',
      kode_hal: kode_hal,
      fullText: text,
    };
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setSelectedTujuan(null);
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={handleReset}>
        Batal
      </Button>
      <Button
        variant="primary"
        onClick={handleUpload}
        loading={isLoading}
        disabled={!selectedFile}
        icon={<Upload className="w-4 h-4" />}
      >
        Upload & Parse
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload File Word Surat" footer={footer}>
      <div className="space-y-4">
        {/* Info Box */}
        <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-semibold mb-1">Fitur Upload Word</p>
            <p className="text-xs">Upload file .docx dan sistem akan otomatis extract informasi seperti perihal, tujuan, dan konten surat untuk diisi ke form.</p>
          </div>
        </div>

        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pilih File Word (.docx)
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".docx"
              onChange={handleFileSelect}
              disabled={isLoading}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Klik untuk upload atau drag & drop file
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Maksimal 5MB
              </p>
            </div>
          </div>
        </div>

        {/* File Preview */}
        {filePreview && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{filePreview.name}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {filePreview.type} • {filePreview.size}
                </p>
                <p className="text-xs text-green-700 mt-2 font-medium">
                  ✓ File siap diupload
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tujuan / Kepada Selection */}
        <SearchSelect
          label="Tujuan / Kepada"
          selected={selectedTujuan}
          onChange={setSelectedTujuan}
          placeholder="Pilih dosen penerima..."
          isMulti={true}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Penanda Tangan"
            options={penandaTanganOptions}
            value={selectedPenandaTangan}
            onChange={(e) => setSelectedPenandaTangan(e.target.value)}
            placeholder="Pilih penanda tangan..."
          />

          <Select
            label="Verifikator"
            options={verifikatorOptions}
            value={selectedVerifikator}
            onChange={(e) => setSelectedVerifikator(e.target.value)}
            placeholder="Pilih verifikator..."
          />
        </div>

        {/* Instruksi */}
        <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>File harus dalam format .docx (Word 2007+)</li>
            <li>Sistem akan mengekstrak "Perihal" dan "Tujuan" otomatis</li>
            <li>Anda masih bisa mengedit data setelah upload</li>
            <li>Data akan diisi ke form pembuatan surat</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUploadWordSurat;
