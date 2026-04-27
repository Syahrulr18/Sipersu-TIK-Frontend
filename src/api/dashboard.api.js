import api from './axios';

/** GET /dashboard/statistik — Dashboard statistics */
export const getDashboardStats = () => api.get('/dashboard/statistik');

/** GET /dashboard/chart — Chart data (monthly) */
export const getDashboardChart = () => api.get('/dashboard/chart');

/** GET /dashboard/recent — Recent letters */
export const getDashboardRecent = () => api.get('/dashboard/recent');
