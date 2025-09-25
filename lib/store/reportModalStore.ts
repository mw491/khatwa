import { create } from "zustand";

export type ReportModalType =
  | "incorrect_timings"
  | "new_mosque"
  | "feature_request"
  | null;

interface ReportModalStore {
  isOpen: boolean;
  reportModalType: ReportModalType;
  openReportModal: (type: ReportModalType) => void;
  closeReportModal: () => void;
}

export const useReportModalStore = create<ReportModalStore>((set) => ({
  isOpen: false,
  reportModalType: null,
  openReportModal: (type: ReportModalType) => {
    set({ isOpen: true, reportModalType: type });
  },
  closeReportModal: () => {
    set({ isOpen: false, reportModalType: null });
  },
}));
