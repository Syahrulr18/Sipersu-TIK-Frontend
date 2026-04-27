import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as notifApi from '@/api/notifikasi.api';

/**
 * Hook to fetch notification list.
 */
export const useNotifikasiList = () => {
  return useQuery({
    queryKey: ['notifikasi'],
    queryFn: () => notifApi.getNotifikasiList().then((r) => r.data),
    refetchInterval: 30000,
  });
};

/**
 * Hook to fetch unread notification count.
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifikasi', 'unread-count'],
    queryFn: () => notifApi.getUnreadCount().then((r) => r.data),
    refetchInterval: 30000,
  });
};

/**
 * Hook to mark single notification as read.
 */
export const useBacaNotifikasi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notifApi.bacaNotifikasi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifikasi'] });
    },
  });
};

/**
 * Hook to mark all notifications as read.
 */
export const useBacaSemua = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notifApi.bacaSemua,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifikasi'] });
    },
  });
};
