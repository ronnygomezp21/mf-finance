// [AI-GENERATED | skill: mf-feature-skill | spec: tasks/mf-finance/feat-001-mf-alta-proveedor.md
//  | ticket: #001 | model: claude-sonnet-4-6]

import { CatalogValueI } from '../services/supplier.service';

// ─── Datos Generales ──────────────────────────────

export const CONTRIBUTOR_TYPES: CatalogValueI[] = [
  { id: 1, name: 'Persona Natural' },
  { id: 2, name: 'Persona Jurídica' },
];

export const IDENTIFICATION_TYPES: CatalogValueI[] = [
  { id: 1, name: 'RUC' },
  { id: 2, name: 'Cédula' },
  { id: 3, name: 'Pasaporte' },
];

export const FREQUENCIES: CatalogValueI[] = [
  { id: 1, name: 'Ocasional' },
  { id: 2, name: 'Permanente' },
];

export const RESIDENCIES: CatalogValueI[] = [
  { id: 1, name: 'Nacional' },
  { id: 2, name: 'Extranjero' },
];

export const CLASSIFICATIONS: CatalogValueI[] = [
  { id: 1, name: 'Servicios Profesionales' },
  { id: 2, name: 'Bienes y Suministros' },
  { id: 3, name: 'Tecnología' },
  { id: 4, name: 'Consultoría' },
  { id: 5, name: 'Médicos' },
  { id: 6, name: 'Seguros' },
  { id: 7, name: 'Mantenimiento' },
  { id: 8, name: 'Transporte y Logística' },
];

// ─── Selects Sí/No ───────────────────────────────

export const YES_NO_OPTIONS: CatalogValueI[] = [
  { id: 1, name: 'Sí' },
  { id: 2, name: 'No' },
];

// ─── Datos Fiscales ──────────────────────────────

export const COUNTRIES: CatalogValueI[] = [
  { id: 1, name: 'Ecuador' },
  { id: 2, name: 'Colombia' },
  { id: 3, name: 'Perú' },
  { id: 4, name: 'Estados Unidos' },
  { id: 5, name: 'España' },
  { id: 6, name: 'México' },
  { id: 7, name: 'Chile' },
  { id: 8, name: 'Argentina' },
];

export const PROVINCES: CatalogValueI[] = [
  { id: 1, name: 'Guayas' },
  { id: 2, name: 'Pichincha' },
  { id: 3, name: 'Azuay' },
  { id: 4, name: 'Manabí' },
  { id: 5, name: 'El Oro' },
  { id: 6, name: 'Tungurahua' },
  { id: 7, name: 'Los Ríos' },
  { id: 8, name: 'Esmeraldas' },
  { id: 9, name: 'Loja' },
  { id: 10, name: 'Chimborazo' },
];

export const CITIES: CatalogValueI[] = [
  { id: 1, name: 'Guayaquil' },
  { id: 2, name: 'Quito' },
  { id: 3, name: 'Cuenca' },
  { id: 4, name: 'Ambato' },
  { id: 5, name: 'Manta' },
  { id: 6, name: 'Machala' },
  { id: 7, name: 'Portoviejo' },
  { id: 8, name: 'Riobamba' },
];

export const ACTIVITY_TYPES: CatalogValueI[] = [
  { id: 1, name: 'Bien' },
  { id: 2, name: 'Servicio' },
  { id: 3, name: 'Bien y Servicio' },
];

export const TAXPAYER_CATEGORIES: CatalogValueI[] = [
  { id: 1, name: 'Contribuyente Especial' },
  { id: 2, name: 'Contribuyente Ordinario' },
  { id: 3, name: 'RISE' },
  { id: 4, name: 'No Obligado' },
];

export const SERVICE_TYPES: string[] = [
  'Predomina mano de obra',
  'Predomina intelecto',
  'Servicio profesional',
  'Otros servicios',
  'Comisiones',
];

export const GOOD_TYPES: string[] = [
  'Activos fijos',
  'Bienes',
];

// ─── Datos Bancarios ─────────────────────────────

export const PAYMENT_METHODS: CatalogValueI[] = [
  { id: 1, name: 'Cheque' },
  { id: 2, name: 'Efectivo' },
  { id: 3, name: 'Transferencia' },
];

export const ACCOUNT_TYPES: CatalogValueI[] = [
  { id: 1, name: 'Ahorro' },
  { id: 2, name: 'Corriente' },
];

export const BANK_NAMES: CatalogValueI[] = [
  { id: 1, name: 'Banco Pichincha' },
  { id: 2, name: 'Banco Guayaquil' },
  { id: 3, name: 'Produbanco' },
  { id: 4, name: 'Banco del Pacífico' },
  { id: 5, name: 'Banco Bolivariano' },
  { id: 6, name: 'Banco Internacional' },
];

export const CURRENCIES: CatalogValueI[] = [
  { id: 1, name: 'USD' },
  { id: 2, name: 'EUR' },
];

export const YES_NO: CatalogValueI[] = [
  { id: 1, name: 'SI' },
  { id: 2, name: 'NO' },
];

export const PAYMENT_ID_TYPES: CatalogValueI[] = [
  { id: 1, name: 'RUC' },
  { id: 2, name: 'Cédula' },
  { id: 3, name: 'Pasaporte' },
];

export const SHIPPING_COSTS: CatalogValueI[] = [
  { id: 1, name: 'SHA' },
  { id: 2, name: 'OUR' },
];

export const RELATIONSHIP_TYPES: CatalogValueI[] = [
  { id: 1, name: 'Familiar' },
  { id: 2, name: 'Comercial' },
  { id: 3, name: 'Laboral' },
];

// ─── Proveedor del Exterior ─────────────────────

export const RESIDENT_PAYMENT_TYPES: CatalogValueI[] = [
  { id: 1, name: 'Pago a residentes' },
  { id: 2, name: 'Establecimiento permanente' },
  { id: 3, name: 'Pago a no residente' },
];

export const FISCAL_REGIME_TYPES: CatalogValueI[] = [
  { id: 1, name: 'Paraíso fiscal' },
  { id: 2, name: 'Régimen general' },
  { id: 3, name: 'Régimen fiscal preferente' },
];

// ─── Datos de Contacto ──────────────────────────

export const CONTACT_TYPES: CatalogValueI[] = [
  { id: 1, name: 'General' },
  { id: 2, name: 'Retención' },
];

export const PHONE_TYPES: CatalogValueI[] = [
  { id: 1, name: 'Celular' },
  { id: 2, name: 'Convencional' },
];

// ─── Retenciones ─────────────────────────────────

export interface RetentionCodeI {
  code: string;
  description: string;
  percentage: number;
}

export interface RetentionTypeI {
  type: string;
  entity: string;
  codes: RetentionCodeI[];
}

export const RETENTION_CATALOG: RetentionTypeI[] = [
  {
    type: 'Ret. Fuente',
    entity: 'SRI',
    codes: [
      { code: 'RF1', description: 'Honorarios profesionales', percentage: 10 },
      { code: 'RF2', description: 'Servicios predomina mano de obra', percentage: 2 },
    ],
  },
  {
    type: 'Ret. IVA',
    entity: 'SRI',
    codes: [
      { code: 'IVA30', description: 'Retención IVA bienes', percentage: 30 },
      { code: 'IVA70', description: 'Retención IVA servicios', percentage: 70 },
    ],
  },
  {
    type: 'Ret. SCVS',
    entity: 'SCVS',
    codes: [
      { code: 'RPJ5K', description: 'Contribución societaria', percentage: 0.50 },
      { code: 'RPJ2K', description: 'Contribución societaria reducida', percentage: 0.20 },
    ],
  },
];

/** Estado por defecto para proveedores nuevos */
export const SUPPLIER_STATUS: CatalogValueI[] = [
  { id: 1, name: 'Activo' },
  { id: 2, name: 'Inactivo' },
];
