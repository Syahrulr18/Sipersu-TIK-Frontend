import { useState } from 'react';
import { ChevronDown, BookOpen, HelpCircle, FileText, Users, MessageSquare, ArrowRight } from 'lucide-react';

const PanduanBantuan = () => {
  const [expandedSection, setExpandedSection] = useState('overview');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'overview',
      title: 'Panduan Umum Aplikasi',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Tentang Sipersu-TIK</h4>
            <p className="text-sm text-blue-800">
              Sipersu-TIK adalah sistem persuratan digital untuk Jurusan Teknik Informatika dan Komputer, 
              Politeknik Negeri Ujung Pandang (PNUP). Aplikasi ini memudahkan proses pembuatan, verifikasi, 
              dan persetujuan surat secara digital.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Fitur Utama</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-[#8B0000] font-bold">✓</span>
                <span className="text-sm text-gray-700"><strong>Pembuatan Surat Digital:</strong> Buat surat dengan editor yang mudah digunakan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8B0000] font-bold">✓</span>
                <span className="text-sm text-gray-700"><strong>Upload Word:</strong> Upload file Word (.docx) untuk auto-extract data ke form</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8B0000] font-bold">✓</span>
                <span className="text-sm text-gray-700"><strong>Workflow Verifikasi:</strong> Proses persetujuan surat melalui beberapa tahap</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8B0000] font-bold">✓</span>
                <span className="text-sm text-gray-700"><strong>Tanda Tangan Digital:</strong> Persetujuan dan tanda tangan dari pimpinan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8B0000] font-bold">✓</span>
                <span className="text-sm text-gray-700"><strong>Dashboard & Notifikasi:</strong> Monitor status surat secara real-time</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Alur Workflow Surat</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm mb-3">
                <span className="bg-[#8B0000] text-white px-3 py-1 rounded-full text-xs font-bold">1</span>
                <span className="text-gray-700"><strong>Draft:</strong> Admin membuat surat baru</span>
              </div>
              <div className="flex items-center gap-2 ml-4 mb-3 text-gray-400">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 text-sm mb-3">
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">2</span>
                <span className="text-gray-700"><strong>Verifikasi:</strong> Sekretaris Jurusan memverifikasi surat</span>
              </div>
              <div className="flex items-center gap-2 ml-4 mb-3 text-gray-400">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 text-sm mb-3">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">3</span>
                <span className="text-gray-700"><strong>Persetujuan Kajur:</strong> Kepala Jurusan memberikan persetujuan & tanda tangan</span>
              </div>
              <div className="flex items-center gap-2 ml-4 mb-3 text-gray-400">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">4</span>
                <span className="text-gray-700"><strong>Terbit:</strong> Surat selesai dan mendapat nomor resmi</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'roles',
      title: 'Panduan Per Role',
      icon: Users,
      content: (
        <div className="space-y-6">
          {/* Admin */}
          <div className="border-l-4 border-[#8B0000] bg-red-50 p-4 rounded">
            <h4 className="font-semibold text-[#8B0000] mb-3 flex items-center gap-2">
              <span className="bg-[#8B0000] text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">A</span>
              Administrator
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Tugas Utama:</strong> Mengelola pembuatan surat, user, dan sistem</p>
              <p><strong>Menu yang Tersedia:</strong></p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• <strong>Daftar Surat:</strong> Lihat semua surat dengan filter status</li>
                <li>• <strong>Kelola User:</strong> Tambah/edit/hapus user dan role</li>
                <li>• <strong>Upload Word:</strong> Upload file Word untuk membuat surat cepat</li>
                <li>• <strong>Tambah Surat:</strong> Buat surat baru dengan editor</li>
              </ul>
              <p><strong className="text-[#8B0000]">Tombol Aksi di Beranda:</strong></p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Tombol biru "Upload Word" - Upload file .docx</li>
                <li>• Tombol merah "Tambah Surat" - Buat surat manual</li>
              </ul>
            </div>
          </div>

          {/* Verifikator */}
          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
            <h4 className="font-semibold text-yellow-700 mb-3 flex items-center gap-2">
              <span className="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">V</span>
              Verifikator (Sekretaris Jurusan)
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Tugas Utama:</strong> Memverifikasi surat dari admin sebelum dikirim ke Kajur</p>
              <p><strong>Menu yang Tersedia:</strong></p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• <strong>Antrian Verifikasi:</strong> Lihat daftar surat yang perlu diverifikasi</li>
                <li>• <strong>Review Surat:</strong> Periksa isi surat dan berikan catatan jika ada revisi</li>
              </ul>
              <p><strong className="text-yellow-700">Aksi yang Bisa Dilakukan:</strong></p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• ✓ Setujui surat (teruskan ke Kajur)</li>
                <li>• ✗ Tolak surat (kembalikan dengan catatan perbaikan)</li>
              </ul>
            </div>
          </div>

          {/* Kajur */}
          <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
            <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
              <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">K</span>
              Kajur (Kepala Jurusan)
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Tugas Utama:</strong> Memberikan persetujuan akhir dan tanda tangan digital pada surat</p>
              <p><strong>Menu yang Tersedia:</strong></p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• <strong>Menunggu Tanda Tangan:</strong> Daftar surat yang perlu ditandatangani</li>
                <li>• <strong>Lihat Persetujuan:</strong> Review surat sebelum ditandatangani</li>
              </ul>
              <p><strong className="text-orange-700">Aksi yang Bisa Dilakukan:</strong></p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• ✓ Setujui & Tanda Tangan (surat terbit dengan nomor resmi)</li>
                <li>• ✗ Tolak (kembalikan ke admin dengan alasan)</li>
              </ul>
            </div>
          </div>

          {/* Dosen */}
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
            <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">D</span>
              Dosen
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Tugas Utama:</strong> Melihat surat yang sudah terbit (sudah disetujui dan ditandatangani)</p>
              <p><strong>Menu yang Tersedia:</strong></p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• <strong>Daftar Surat:</strong> Lihat surat yang sudah terbit</li>
                <li>• <strong>Lihat Detail:</strong> Buka surat untuk membaca atau download PDF</li>
              </ul>
              <p><strong className="text-blue-700">Aksi yang Bisa Dilakukan:</strong></p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Download surat sebagai PDF</li>
                <li>• Lihat detail surat lengkap</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tutorial',
      title: 'Tutorial Fitur Utama',
      icon: FileText,
      content: (
        <div className="space-y-6">
          {/* Buat Surat */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#8B0000]">→</span> Cara Membuat Surat Baru
            </h4>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Masuk ke <strong>Beranda</strong> atau <strong>Daftar Surat</strong></li>
              <li>Klik tombol <strong>"Tambah Surat"</strong> (merah) di bagian toolbar</li>
              <li>Isi form dengan data:
                <ul className="ml-6 space-y-1 mt-1">
                  <li>• Penanda Tangan (pilih pejabat yang akan menandatangani)</li>
                  <li>• Verifikator (pilih yang akan verifikasi)</li>
                  <li>• Tujuan (pilih tujuan surat)</li>
                  <li>• Kode Hal (pilih kategori surat)</li>
                  <li>• Perihal (tulis judul surat, max 255 karakter)</li>
                  <li>• Ringkasan/Isi (tulis isi surat singkat)</li>
                  <li>• Lampiran (opsional, upload file pendukung)</li>
                </ul>
              </li>
              <li>Klik <strong>"Save Draft"</strong> untuk menyimpan</li>
              <li>Surat tersimpan dengan status "Draft" dan menunggu verifikasi</li>
            </ol>
          </div>

          {/* Upload Word */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#8B0000]">→</span> Cara Upload File Word
            </h4>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Masuk ke <strong>Beranda</strong> atau <strong>Daftar Surat</strong></li>
              <li>Klik tombol <strong>"Upload Word"</strong> (biru) di bagian toolbar</li>
              <li>Pilih file Word (.docx) maksimal 5MB dari komputer Anda</li>
              <li>Sistem akan otomatis extract data:
                <ul className="ml-6 space-y-1 mt-1">
                  <li>• Mencari "Perihal:" untuk judul surat</li>
                  <li>• Mencari "Kepada:" untuk tujuan</li>
                  <li>• Mencari "Tujuan:" untuk destinasi surat</li>
                  <li>• Menyimpan seluruh teks dokumen</li>
                </ul>
              </li>
              <li>Form akan otomatis terbuka dengan data yang sudah terisi</li>
              <li>Lengkapi field lainnya dan klik "Save Draft"</li>
            </ol>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
              <p className="text-xs text-blue-800">
                <strong>💡 Tips:</strong> Untuk hasil terbaik, pastikan file Word Anda memiliki 
                format "Perihal: [Judul]" di bagian awal dokumen.
              </p>
            </div>
          </div>

          {/* Verifikasi */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#8B0000]">→</span> Cara Verifikasi Surat (Sekretaris Jurusan)
            </h4>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Masuk dengan role <strong>Verifikator</strong></li>
              <li>Buka menu <strong>"Antrian Verifikasi"</strong></li>
              <li>Klik tombol <strong>"Review"</strong> pada surat yang ingin diperiksa</li>
              <li>Baca isi surat dan periksa keaslian data</li>
              <li>Tulis catatan jika ada revisi (opsional)</li>
              <li>Pilih aksi:
                <ul className="ml-6 space-y-1 mt-1">
                  <li>• <strong>Setujui:</strong> Surat diteruskan ke Kajur</li>
                  <li>• <strong>Tolak:</strong> Surat dikembalikan ke Admin dengan catatan</li>
                </ul>
              </li>
            </ol>
          </div>

          {/* Persetujuan */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#8B0000]">→</span> Cara Tanda Tangan & Persetujuan (Kajur)
            </h4>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Masuk dengan role <strong>Kajur</strong></li>
              <li>Buka menu <strong>"Menunggu Tanda Tangan"</strong></li>
              <li>Klik <strong>"Lihat Persetujuan"</strong> pada surat</li>
              <li>Review detail surat secara menyeluruh</li>
              <li>Untuk setujui:
                <ul className="ml-6 space-y-1 mt-1">
                  <li>• Klik tombol <strong>"Setujui"</strong> (hijau)</li>
                  <li>• Upload tanda tangan/paraf digital (opsional)</li>
                  <li>• Klik "Ya, Setujui" untuk konfirmasi</li>
                </ul>
              </li>
              <li>Surat akan langsung terbit dengan nomor resmi</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'faq',
      title: 'Pertanyaan Umum (FAQ)',
      icon: HelpCircle,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">❓ Berapa lama waktu verifikasi surat?</h5>
            <p className="text-sm text-gray-700">
              Waktu verifikasi tergantung dari Sekretaris Jurusan. Biasanya 1-2 hari kerja. 
              Anda akan mendapat notifikasi saat surat disetujui atau perlu revisi.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">❓ Bagaimana jika surat ditolak verifikator?</h5>
            <p className="text-sm text-gray-700">
              Surat akan dikembalikan ke Admin dengan catatan perbaikan. 
              Buka surat di "Daftar Surat", lihat catatan di bagian timeline, 
              edit surat, kemudian submit ulang untuk verifikasi.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">❓ Bagaimana cara edit surat yang sudah dibuat?</h5>
            <p className="text-sm text-gray-700">
              Buka "Daftar Surat", cari surat yang ingin diedit, klik ikon mata/detail, 
              kemudian klik tombol "Edit" di bagian kanan. Hanya surat dengan status "Draft" 
              atau "Perlu Perbaikan" yang bisa diedit.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">❓ Kapan surat mendapat nomor resmi?</h5>
            <p className="text-sm text-gray-700">
              Nomor surat digenerate otomatis <strong>setelah Kajur memberikan persetujuan dan tanda tangan</strong>. 
              Nomor akan langsung muncul di halaman surat detail dengan format: M.001/9/KL.01.00/2026
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">❓ Apakah bisa download surat sebagai PDF?</h5>
            <p className="text-sm text-gray-700">
              Ya, setelah surat terbit (sudah disetujui Kajur), Anda bisa membuka detail surat 
              dan klik tombol "Download PDF" untuk mendownload surat dalam format PDF.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">❓ Bagaimana jika lupa password?</h5>
            <p className="text-sm text-gray-700">
              Hubungi Administrator Sistem atau klik link "Lupa Password?" di halaman login. 
              Anda akan diminta untuk verifikasi email terdaftar dan membuat password baru.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">❓ Berapa ukuran maksimal file yang bisa diupload?</h5>
            <p className="text-sm text-gray-700">
              Untuk file Word (.docx): maksimal 5MB. Untuk lampiran surat: maksimal 10MB per file. 
              Total lampiran dalam satu surat maksimal 50MB.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">❓ Berapa karakter maksimal untuk perihal surat?</h5>
            <p className="text-sm text-gray-700">
              Perihal surat maksimal 255 karakter. Sistem akan memberitahu jika Anda melebihi batas. 
              Pastikan perihal singkat dan jelas menggambarkan isi surat.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'glossary',
      title: 'Istilah & Definisi',
      icon: BookOpen,
      content: (
        <div className="space-y-3">
          <div className="border-l-4 border-[#8B0000] pl-4 py-2">
            <h5 className="font-semibold text-gray-900">Draft</h5>
            <p className="text-sm text-gray-600">Status surat yang baru dibuat tapi belum dikirim untuk verifikasi</p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h5 className="font-semibold text-gray-900">Menunggu Verifikasi</h5>
            <p className="text-sm text-gray-600">Status surat yang sudah dikirim ke Sekretaris Jurusan untuk diverifikasi</p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4 py-2">
            <h5 className="font-semibold text-gray-900">Menunggu Persetujuan Kajur</h5>
            <p className="text-sm text-gray-600">Status surat yang sudah diverifikasi dan menunggu persetujuan dari Kepala Jurusan</p>
          </div>

          <div className="border-l-4 border-green-600 pl-4 py-2">
            <h5 className="font-semibold text-gray-900">Telah Disetujui / Terbit</h5>
            <p className="text-sm text-gray-600">Status surat yang sudah mendapat persetujuan dan tanda tangan dari Kajur, serta sudah memiliki nomor resmi</p>
          </div>

          <div className="border-l-4 border-red-600 pl-4 py-2">
            <h5 className="font-semibold text-gray-900">Perlu Perbaikan / Ditolak</h5>
            <p className="text-sm text-gray-600">Status surat yang ditolak verifikator atau Kajur dengan alasan/catatan perbaikan</p>
          </div>

          <div className="border-l-4 border-gray-400 pl-4 py-2">
            <h5 className="font-semibold text-gray-900">Verifikator</h5>
            <p className="text-sm text-gray-600">Sekretaris Jurusan yang bertugas memverifikasi keakuratan dan kelengkapan surat sebelum dikirim ke Kajur</p>
          </div>

          <div className="border-l-4 border-gray-400 pl-4 py-2">
            <h5 className="font-semibold text-gray-900">Kajur (Kepala Jurusan)</h5>
            <p className="text-sm text-gray-600">Pimpinan Jurusan yang memberikan persetujuan akhir dan tanda tangan digital pada surat</p>
          </div>

          <div className="border-l-4 border-gray-400 pl-4 py-2">
            <h5 className="font-semibold text-gray-900">Kode Hal</h5>
            <p className="text-sm text-gray-600">Kode klasifikasi surat berdasarkan kategori (Kelembagaan, Akademik, Kepegawaian, dll)</p>
          </div>

          <div className="border-l-4 border-gray-400 pl-4 py-2">
            <h5 className="font-semibold text-gray-900">Nomor Surat</h5>
            <p className="text-sm text-gray-600">Nomor unik surat dalam format M.XXX/9/[KODE_HAL]/[TAHUN] yang digenerate otomatis setelah persetujuan Kajur</p>
          </div>

          <div className="border-l-4 border-gray-400 pl-4 py-2">
            <h5 className="font-semibold text-gray-900">Penanda Tangan</h5>
            <p className="text-sm text-gray-600">Pejabat yang akan menandatangani surat (biasanya Kajur atau pimpinan lainnya)</p>
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      title: 'Hubungi Support',
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3">Hubungi Tim Support</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Email Support</p>
                <p className="text-sm text-gray-600">
                  <a href="mailto:support@pnup.ac.id" className="text-[#8B0000] hover:underline">
                    support@pnup.ac.id
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">WhatsApp</p>
                <p className="text-sm text-gray-600">
                  <a href="https://wa.me/6285123456789" className="text-[#8B0000] hover:underline">
                    +62 851-2345-6789
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Telepon</p>
                <p className="text-sm text-gray-600">(0411) 585-9911</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Jam Kerja</p>
                <p className="text-sm text-gray-600">Senin - Jumat, 08:00 - 16:00 WITA</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">Info Teknis</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Browser yang Disupport:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Chrome 90+</li>
                <li>• Firefox 88+</li>
                <li>• Safari 14+</li>
                <li>• Edge 90+</li>
              </ul>
              <p className="mt-3"><strong>Kompatibilitas Mobile:</strong> Responsif untuk smartphone dan tablet</p>
              <p><strong>RAM Minimum:</strong> 2GB</p>
              <p><strong>Kecepatan Internet:</strong> 1Mbps (stabil)</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Laporkan Bug</h4>
            <p className="text-sm text-gray-700">
              Jika Anda menemukan bug atau error, mohon segera laporkan melalui email support 
              dengan menyertakan:
            </p>
            <ul className="ml-4 space-y-1 text-sm text-gray-700 mt-2">
              <li>• Deskripsi lengkap masalah</li>
              <li>• Screenshot atau video demonstrasi</li>
              <li>• Browser yang digunakan</li>
              <li>• Waktu kejadian bug</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-[#8B0000]" />
            <h1 className="text-3xl font-bold text-gray-900">Panduan & Bantuan</h1>
          </div>
          <p className="text-gray-600">
            Temukan jawaban atas pertanyaan Anda tentang cara menggunakan Sipersu-TIK. 
            Pilih topik di bawah untuk mempelajari lebih lanjut.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
                {/* Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#8B0000]" />
                    <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isExpanded ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-white">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 bg-gradient-to-r from-[#8B0000] to-red-700 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Masih Butuh Bantuan?</h3>
          <p className="text-red-50 mb-4">
            Jika Anda tidak menemukan jawaban yang Anda cari, jangan ragu untuk menghubungi 
            tim support kami. Kami siap membantu Anda 24/7.
          </p>
          <a
            href="mailto:support@pnup.ac.id"
            className="inline-block bg-white text-[#8B0000] font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hubungi Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PanduanBantuan;
