import { Environment } from './environment.interface';

/**
 * Environment de desarrollo local.
 * En producción se genera vía load-env.js — NO commitear cambios con datos reales.
 */
export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
