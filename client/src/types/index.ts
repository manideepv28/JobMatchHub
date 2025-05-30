export interface JobFilters {
  search: string;
  category: string;
  location: string;
  salary: string;
  jobTypes: string[];
  sortBy: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
