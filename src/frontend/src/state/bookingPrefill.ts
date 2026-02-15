import { create } from 'zustand';

interface BookingPrefillState {
  preselectedService: string | null;
  setPreselectedService: (service: string) => void;
  clearPrefill: () => void;
}

export const useBookingPrefill = create<BookingPrefillState>((set) => ({
  preselectedService: null,
  setPreselectedService: (service) => set({ preselectedService: service }),
  clearPrefill: () => set({ preselectedService: null }),
}));
