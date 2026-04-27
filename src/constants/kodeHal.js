/**
 * KODE_HAL_LIST — Daftar lengkap kode klasifikasi surat dinas.
 * Digunakan di dropdown GroupedSelect pada form Tambah Surat.
 * Format tampilan: "KL.01.00 — Sosialisasi Kelembagaan"
 */
export const KODE_HAL_LIST = [
  // KELEMBAGAAN DIKTI
  { kode: "KL.00", nama: "Akreditasi Perguruan Tinggi", kategori: "Kelembagaan Dikti" },
  { kode: "KL.01.00", nama: "Sosialisasi Kelembagaan", kategori: "Kelembagaan Dikti" },
  { kode: "KL.02.00", nama: "Fasilitasi Perguruan Tinggi", kategori: "Kelembagaan Dikti" },
  { kode: "KL.03.00", nama: "Database Perguruan Tinggi", kategori: "Kelembagaan Dikti" },
  // KEMAHASISWAAN DIKTI
  { kode: "KM.00", nama: "Kemahasiswaan", kategori: "Kemahasiswaan Dikti" },
  { kode: "KM.01", nama: "Kegiatan Kemahasiswaan", kategori: "Kemahasiswaan Dikti" },
  // AKADEMIK DIKTI
  { kode: "AL.00", nama: "Akademik", kategori: "Akademik Dikti" },
  { kode: "AL.01", nama: "Uji Kompetensi", kategori: "Akademik Dikti" },
  { kode: "AL.02", nama: "Pengelolaan Akademik", kategori: "Akademik Dikti" },
  { kode: "AL.03", nama: "Kurikulum", kategori: "Akademik Dikti" },
  { kode: "AL.04", nama: "Pembelajaran", kategori: "Akademik Dikti" },
  // PENDIDIKAN TINGGI
  { kode: "DT.00", nama: "Pembelajaran Pendidikan Tinggi", kategori: "Pendidikan Tinggi" },
  { kode: "DT.01", nama: "Kemahasiswaan Pendidikan Tinggi", kategori: "Pendidikan Tinggi" },
  { kode: "DT.02", nama: "Penjaminan Mutu", kategori: "Pendidikan Tinggi" },
  { kode: "DT.03", nama: "Kelembagaan Pendidikan Tinggi", kategori: "Pendidikan Tinggi" },
  { kode: "DT.04", nama: "Sumber Daya Pendidikan Tinggi", kategori: "Pendidikan Tinggi" },
  { kode: "DT.05", nama: "Ilmu Pengetahuan dan Teknologi", kategori: "Pendidikan Tinggi" },
  { kode: "DT.06", nama: "Pengabdian kepada Masyarakat", kategori: "Pendidikan Tinggi" },
  // GURU & TENDIK
  { kode: "GT.00", nama: "Perencanaan Guru & Tendik", kategori: "Guru & Tendik" },
  { kode: "GT.01", nama: "Pengembangan Guru & Tendik", kategori: "Guru & Tendik" },
  { kode: "GT.02", nama: "Penilaian Guru & Tendik", kategori: "Guru & Tendik" },
  { kode: "GT.03", nama: "Sertifikasi Guru & Tendik", kategori: "Guru & Tendik" },
  // KEPEGAWAIAN
  { kode: "KP.00", nama: "Perencanaan Pegawai", kategori: "Kepegawaian" },
  { kode: "KP.01", nama: "Pengadaan Pegawai", kategori: "Kepegawaian" },
  { kode: "KP.04", nama: "Pembinaan Karier Pegawai", kategori: "Kepegawaian" },
  { kode: "KP.07", nama: "Pembinaan Jabatan Fungsional", kategori: "Kepegawaian" },
  { kode: "KP.08", nama: "Mutasi Pegawai", kategori: "Kepegawaian" },
  { kode: "KP.11", nama: "Administrasi Pegawai", kategori: "Kepegawaian" },
  { kode: "KP.12", nama: "Cuti Pegawai", kategori: "Kepegawaian" },
  { kode: "KP.13", nama: "Kesejahteraan Pegawai", kategori: "Kepegawaian" },
  { kode: "KP.14", nama: "Pemberhentian Pegawai", kategori: "Kepegawaian" },
  // ORGANISASI & TATA LAKSANA
  { kode: "OT.00", nama: "Organisasi", kategori: "Organisasi & Tata Laksana" },
  { kode: "OT.01", nama: "Reformasi Birokrasi Internal", kategori: "Organisasi & Tata Laksana" },
  { kode: "OT.02", nama: "Ketatalaksanaan", kategori: "Organisasi & Tata Laksana" },
  // TATA USAHA
  { kode: "TU.00", nama: "Persuratan", kategori: "Tata Usaha" },
  { kode: "TU.02", nama: "Keprotokolan", kategori: "Tata Usaha" },
  // HUKUM
  { kode: "HK.00", nama: "Program Legislasi", kategori: "Hukum" },
  { kode: "HK.05", nama: "Surat Perintah", kategori: "Hukum" },
  { kode: "HK.07", nama: "Dokumentasi Hukum", kategori: "Hukum" },
  { kode: "HK.08", nama: "Sosialisasi/Penyuluhan Hukum", kategori: "Hukum" },
  // PERENCANAAN
  { kode: "PR.00", nama: "Pokok-Pokok Kebijakan Strategis", kategori: "Perencanaan" },
  { kode: "PR.02", nama: "Program Kerja Tahunan", kategori: "Perencanaan" },
  { kode: "PR.03", nama: "Penetapan/Kontrak Kinerja", kategori: "Perencanaan" },
  { kode: "PR.04", nama: "Laporan", kategori: "Perencanaan" },
  { kode: "PR.06", nama: "Monitoring dan Evaluasi", kategori: "Perencanaan" },
  // KEUANGAN
  { kode: "KU.00", nama: "Pembinaan Perbendaharaan", kategori: "Keuangan" },
  { kode: "KU.01", nama: "Pelaksanaan Anggaran", kategori: "Keuangan" },
  { kode: "KU.03", nama: "Sistem Akuntansi dan Laporan Keuangan", kategori: "Keuangan" },
  { kode: "KU.04", nama: "Pengelolaan PNBP", kategori: "Keuangan" },
  // LOGISTIK
  { kode: "LK.00", nama: "Pengadaan Barang dan Jasa", kategori: "Logistik" },
  { kode: "LK.01", nama: "Pengelolaan Barang Milik Negara", kategori: "Logistik" },
  { kode: "LK.04", nama: "Penatausahaan BMN", kategori: "Logistik" },
  // PENDIDIKAN & PELATIHAN
  { kode: "PP.00", nama: "Rencana/Program Pelatihan", kategori: "Pendidikan & Pelatihan" },
  { kode: "PP.01", nama: "Penyelenggaraan Pelatihan Klasikal", kategori: "Pendidikan & Pelatihan" },
  { kode: "PP.03", nama: "Pengiriman Peserta Pelatihan", kategori: "Pendidikan & Pelatihan" },
  { kode: "PP.04", nama: "Pengiriman Peserta Pendidikan Gelar", kategori: "Pendidikan & Pelatihan" },
  // TEKNOLOGI INFORMASI
  { kode: "TI.00", nama: "Sistem Informasi Manajemen", kategori: "Teknologi Informasi" },
  { kode: "TI.01", nama: "Implementasi SIM", kategori: "Teknologi Informasi" },
  { kode: "TI.04", nama: "Pembelajaran Elektronik", kategori: "Teknologi Informasi" },
  // KERJA SAMA
  { kode: "KS.01", nama: "Hubungan Masyarakat", kategori: "Kerja Sama" },
  { kode: "KS.03", nama: "Kebudayaan, Ilmu Pengetahuan & Teknologi", kategori: "Kerja Sama" },
  { kode: "KS.07", nama: "Administrasi Beasiswa", kategori: "Kerja Sama" },
  // PENGAWASAN
  { kode: "WS.00", nama: "Pembinaan Pengawasan", kategori: "Pengawasan" },
  { kode: "WS.01", nama: "Pengawasan Internal", kategori: "Pengawasan" },
  // RUMAH TANGGA
  { kode: "RT.00", nama: "Keindahan Kantor", kategori: "Rumah Tangga" },
  { kode: "RT.02", nama: "Pemeliharaan dan Utilitas Kantor", kategori: "Rumah Tangga" },
  { kode: "RT.04", nama: "Operasional dan Layanan", kategori: "Rumah Tangga" },
];

/**
 * Group KODE_HAL_LIST by kategori for dropdown rendering.
 * @returns {Object.<string, Array>}
 */
export const getGroupedKodeHal = () => {
  return KODE_HAL_LIST.reduce((groups, item) => {
    if (!groups[item.kategori]) {
      groups[item.kategori] = [];
    }
    groups[item.kategori].push(item);
    return groups;
  }, {});
};

/**
 * Format display string for kode hal.
 * @param {string} kode
 * @returns {string}
 */
export const formatKodeHal = (kode) => {
  const item = KODE_HAL_LIST.find((k) => k.kode === kode);
  return item ? `${item.kode} — ${item.nama}` : kode;
};
