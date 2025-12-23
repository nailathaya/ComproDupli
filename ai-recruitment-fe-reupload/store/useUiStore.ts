
import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean; // For mobile
  isSidebarCollapsed: boolean; // For desktop
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebarCollapse: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleSidebarCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));