import { PaginationResquestInterface } from './response.interface';

export interface ResourceInterface {
  id?: number;
  uuid?: string;
  name: string;
  description: string;
  status?: boolean;
  actions: ResourceActionInterface[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ResourceDetailInterface {
  uuid: string;
  name: string;
  actions?: ResourceDetailInterface[];
}

export interface ResourceActionInterface {
  id?: number;
  uuid?: string;
  name: string;
  description: string;
  method: string;
  url: string;
  resourceId: number;
  status?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ResourceParamsInterface extends PaginationResquestInterface {
  status: boolean | null;
}
