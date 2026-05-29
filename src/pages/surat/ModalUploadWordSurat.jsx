import { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

/**
 * ModalUploadWordSurat — Upload file Word (.docx) dan extract data
 * Frontend only - Extract basic information dari file
 */
const ModalUploadWordSurat = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

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
    // Extract informasi dari text dokumen Word
    // Ini adalah contoh parsing sederhana
    
    const lines = text.split('\n').filter(l => l.trim());
    
    // Cari perihal/hal (biasanya setelah kata "Perihal:" atau "Hal:")
    let hal = '';
    let ringkasan = '';
    let tujuan = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('perihal:') || line.includes('hal:')) {
        hal = lines[i].replace(/perihal:|hal:/gi, '').trim();
        // Ambil beberapa baris ke depan untuk ringkasan
        if (i + 1 < lines.length) {
          ringkasan = lines.slice(i + 1, Math.min(i + 4, lines.length))
            .join(' ')
            .substring(0, 200);
        }
        break;
      }
    }

    // Cari tujuan/kepada
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('kepada') || line.includes('tujuan')) {
        tujuan = lines[i].replace(/kepada:|tujuan:/gi, '').trim();
        break;
      }
    }

    return {
      hal: hal || 'Data dari upload Word',
      ringkasan: ringkasan || text.substring(0, 200),
      tujuan: tujuan,
      fullText: text, // Simpan full text untuk referensi
    };
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFilePreview(null);
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
