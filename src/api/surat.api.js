import api from './axios';

/** GET /surat — Daftar surat with filters */
export const getSuratList = (params) => api.get('/surat', { params });

/** GET /surat/:id — Detail surat */
export const getSuratDetail = (id) => api.get(`/surat/${id}`);

/** POST /surat — Create new surat (multipart) */
export const createSurat = (formData) =>
  api.post('/surat', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/** PUT /surat/:id — Update surat data */
export const updateSurat = (id, data) => api.put(`/surat/${id}`, data);

/** PATCH /surat/:id/konten — Update konten HTML */
export const updateKonten = (id, data) => api.patch(`/surat/${id}/konten`, data);

/** POST /surat/:id/submit — Submit to verifikator */
export const submitSurat = (id) => api.post(`/surat/${id}/submit`);

/** POST /surat/:id/verifikasi — Verifikasi (approve/reject) */
export const verifikasiSurat = (id, data) => api.post(`/surat/${id}/verifikasi`, data);

/** POST /surat/:id/tandatangan — Tanda tangan & terbitkan */
export const tandatanganSurat = (id) => api.post(`/surat/${id}/tandatangan`);

/** DELETE /surat/:id — Delete surat */
export const deleteSurat = (id) => api.delete(`/surat/${id}`);

/** GET /surat/:id/pdf — Download PDF */
export const downloadPdf = (id) =>
  api.get(`/surat/${id}/pdf`, { responseType: 'blob' });

/** GET /surat/verifikasi — Antrian verifikasi */
export const getAntrianVerifikasi = (params) =>
  api.get('/surat/verifikasi', { params });

/** GET /surat/tandatangan — Antrian tanda tangan */
export const getAntrianTandaTangan = (params) =>
  api.get('/surat/tandatangan', { params });
