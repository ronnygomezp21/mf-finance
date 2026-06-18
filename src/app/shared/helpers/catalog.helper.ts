import { CatalogValueI } from '../../modules/supplier/services/supplier.service';
import { YES_NO_OPTIONS } from '../../modules/supplier/constants/supplier-catalogs';

/**
 * Resolves a catalog ID to the full CatalogValueI { id, name } object.
 * Returns undefined if the id is null/undefined or not found.
 */
export const resolveCatalog = (
  list: CatalogValueI[],
  id: number | null | undefined,
): CatalogValueI | undefined =>
  id != null ? list.find(item => item.id === id) : undefined;

/**
 * Converts a YES_NO_OPTIONS catalog ID to a boolean value.
 * Sí → true, No → false, null/undefined → undefined.
 */
const yesId = YES_NO_OPTIONS.find(o => o.name === 'Sí')?.id;

export const catalogToBool = (
  id: number | null | undefined,
): boolean | undefined =>
  id != null ? id === yesId : undefined;
