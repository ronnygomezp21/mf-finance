import { Placement } from '@ng-bootstrap/ng-bootstrap';
import { PaginationResquestInterface } from './response.interface';

type FieldType =
  | 'string'
  | 'index'
  | 'tags'
  | 'tooltip'
  | 'status'
  | 'actions'
  | 'JSON'
  | 'actDirectory'
  | 'checkbox';
type PipeType = 'Date' | 'none';
type Action = 'edit' | 'status' | 'lock';

export interface TableColumnDataI {
  name: string;
  dataKey: string;
  type?: FieldType;
  config?: ConfigI;
}

export interface ConfigI {
  status?: StatusConfigI;
  tooltip?: TooltipConfigI;
  actions?: Actions[];
  usePipe?: PipeType;
}

export interface TooltipConfigI {
  placement: Placement;
}

export interface StatusConfigI {
  true: string;
  false: string;
}

export interface Actions {
  action: Action;
  tooltip: string;
  placement: Placement;
  status?: boolean | null;
  icon?: string;
  class?: string;
  tooltipClass?: string;
}

export interface ActionI {
  actionName: string;
  data: any;
  action?: boolean | null;
}

export interface TableLimitI {
  label: string;
  value: number;
}

export interface UserPermissionI {
  allow: {
    action: string[];
  };
  denny: {
    action: string[];
  };
  resource: string[];
}

export interface LoginTypeI {
  id: number;
  code: string;
  name: string;
  status: boolean;
  description: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginTypeParamsI extends PaginationResquestInterface {
  status: boolean | null;
}

export interface ComboFilterI {
  label: string;
  value: number;
}

export interface GeneralFilterI {
  status?: boolean | null;
  entityId: string[] | null;
  roleId: string[] | null;
}

export interface GeneralTypeFilterI {
  status?: boolean | null;
  typeId: string[] | null;
}

export interface DetailsDataI {
  label: string;
  value: string;
}

export interface AssignMenuI {
  name: string;
  menuId: number;
  order: number;
  status: boolean;
  updatedAt: string;
}

export interface AddAssignMenuI {
  menuId: number;
  order: number;
  status: boolean;
}
