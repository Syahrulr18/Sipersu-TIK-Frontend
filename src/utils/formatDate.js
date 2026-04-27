import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format tanggal untuk tampilan tabel/daftar.
 * Output: "24 Okt 2023"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatTanggalShort = (date) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'd MMM yyyy', { locale: id });
};

/**
 * Format tanggal untuk tampilan detail surat.
 * Output: "Senin, 24 Oktober 2023"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatTanggalFull = (date) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEEE, d MMMM yyyy', { locale: id });
};

/**
 * Format tanggal relatif untuk notifikasi.
 * Output: "2 jam lalu", "kemarin", "3 hari lalu"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatTanggalRelatif = (date) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: id });
};

/**
 * Format tanggal untuk surat (header surat).
 * Output: "Makassar, 24 Oktober 2023"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatTanggalSurat = (date) => {
  if (!date) return `Makassar, ${format(new Date(), 'd MMMM yyyy', { locale: id })}`;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return `Makassar, ${format(d, 'd MMMM yyyy', { locale: id })}`;
};

/**
 * Format waktu saja.
 * Output: "14:30"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatWaktu = (date) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm', { locale: id });
};
