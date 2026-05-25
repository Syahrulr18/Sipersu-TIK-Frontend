import { create } from 'zustand';

const usePageTitleStore = create((set) => ({
  title: '',
  setTitle: (title) => set({ title }),
  clearTitle: () => set({ title: '' }),
}));

export default usePageTitleStore;
