export interface ServiceResponseInterface<T> {
  data: T;
  message: string;
}

export interface PaginationResponseInterface<T> {
  records: T;
  total: number;
  page: number;
  totalPages: number;
}

export interface PaginationResquestInterface {
  page: number;
  limit: number;
  search: string | null;
}
