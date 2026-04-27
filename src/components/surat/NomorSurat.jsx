/**
 * NomorSurat — displays formatted surat number.
 * Format: M.[URUTAN 3 DIGIT]/9/[KODE_HAL]/[TAHUN]
 * Example: M.001/9/KL.01.00/2026
 * 
 * @param {string} nomor - the formatted number string, or null for draft
 * @param {string} status - surat status
 */
const NomorSurat = ({ nomor, status }) => {
  if (!nomor || status === 'draft') {
    return (
      <span className="text-sm text-gray-400 font-medium italic">
        DRAFT
      </span>
    );
  }

  return (
    <span className="font-bold text-lg text-gray-900 tracking-wide">
      {nomor}
    </span>
  );
};

export default NomorSurat;
