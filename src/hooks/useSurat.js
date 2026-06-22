import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as suratApi from '@/api/surat.api';

/**
 * Hook to fetch paginated surat list with filters.
 * @param {object} filters - { page, status, kode_hal, search }
 */
export const useSuratList = (filters = {}) => {
  return useQuery({
    queryKey: ['surat', filters],
    queryFn: () => suratApi.getSuratList(filters).then((r) => r.data),
    keepPreviousData: true,
  });
};

/**
 * Hook to fetch surat detail by id.
 * @param {number|string} id
 */
export const useSuratDetail = (id) => {
  return useQuery({
    queryKey: ['surat', id],
    queryFn: () => suratApi.getSuratDetail(id).then((r) => r.data),
    enabled: !!id,
  });
};

/**
 * Hook to create new surat.
 */
export const useCreateSurat = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: suratApi.createSurat,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['surat'] });
      toast.success('Surat berhasil dibuat');
      navigate(`/surat/${res.data.id}/edit-konten`);
    },
  });
};

/**
 * Hook to update surat konten HTML.
 * @param {number|string} id
 */
export const useUpdateKonten = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => suratApi.updateKonten(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surat'] });
    }
  });
};

/**
 * Hook to submit surat to verifikator.
 * @param {number|string} id
 */
export const useSubmitSurat = (id) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => suratApi.submitSurat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surat'] });
      toast.success('Surat berhasil dikirim ke verifikator');
      navigate(`/surat/${id}`);
    },
  });
};

/**
 * Hook to verify/reject surat.
 * @param {number|string} id
 */
export const useVerifikasiSurat = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => suratApi.verifikasiSurat(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['surat'] });
      queryClient.invalidateQueries({ queryKey: ['verifikasi'] });
      const msg = variables.aksi === 'setuju'
        ? 'Surat berhasil diverifikasi'
        : 'Surat ditolak';
      toast.success(msg);
    },
  });
};

/**
 * Hook to sign and publish surat.
 * @param {number|string} id
 */
export const useTandatanganSurat = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => suratApi.tandatanganSurat(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['surat'] });
      queryClient.invalidateQueries({ queryKey: ['tandatangan'] });
      
      const msg = variables?.aksi === 'tolak'
        ? 'Surat ditolak oleh Kajur'
        : 'Surat berhasil ditandatangani & diterbitkan';
      toast.success(msg);
    },
  });
};

/**
 * Hook to delete surat.
 */
export const useDeleteSurat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => suratApi.deleteSurat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surat'] });
      toast.success('Surat berhasil dihapus');
    },
  });
};

/**
 * Hook to fetch antrian verifikasi list.
 */
export const useAntrianVerifikasi = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['verifikasi', params],
    queryFn: () => suratApi.getAntrianVerifikasi(params).then((r) => r.data),
    ...options,
  });
};

/**
 * Hook to fetch antrian tanda tangan list.
 */
export const useAntrianTandaTangan = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['tandatangan', params],
    queryFn: () => suratApi.getAntrianTandaTangan(params).then((r) => r.data),
    ...options,
  });
};
