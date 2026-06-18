#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const env = require('./env-helper.cjs');

/**
 * Console color codes
 */
const COLORS = {
  success: '\x1b[32m%s\x1b[0m',
  error: '\x1b[31m%s\x1b[0m',
  info: '\x1b[36m%s\x1b[0m',
};

const SYMBOLS = {
  check: '\u{2705}',
  cross: '\u{274c}',
};

/**
 * Script para cargar variables de entorno desde .env y generar environment.ts
 * Usa validación de entorno ligera (env-helper.js) en lugar de env-var
 *
 * Genera:
 * - src/environments/environment.ts (variables de runtime)
 */
class EnvironmentManager {
  nodeEnv = null;
  config = null;
  targetPath = null;
  variableDefinitions = {};

  constructor() {
    this.targetPath = path.join(__dirname, '../src/environments');
  }

  /**
   * Configura el schema de variables a procesar automáticamente.
   *
   * API recomendada (tipo env-var):
   * const schema = {
   *   apiUrl: env.schema('API_URL').required().asUrlString(),
   *   timeoutMs: env.schema('TIMEOUT_MS').default('3000').asIntPositive(),
   * };
   * manager.configureSchema(schema).execute();
   *
   * Si agregas nuevas propiedades al objeto, se reflejan automáticamente en logs
   * y en los archivos generados de environments.
   *
   * @param {Record<string, () => unknown>} variableDefinitions
   * @returns {EnvironmentManager} Instancia actual para permitir chaining
   */
  configureSchema(variableDefinitions) {
    if (
      !variableDefinitions ||
      typeof variableDefinitions !== 'object' ||
      Array.isArray(variableDefinitions)
    ) {
      throw new TypeError(
        'variableDefinitions debe ser un objeto con definiciones de variables',
      );
    }

    this.variableDefinitions = variableDefinitions;
    return this;
  }

  // Backward compatibility con el nombre anterior.
  configureVariables(variableDefinitions) {
    return this.configureSchema(variableDefinitions);
  }

  inferTypeScriptTypeFromValue(value) {
    if (typeof value === 'number') {
      return 'number';
    }
    if (typeof value === 'boolean') {
      return 'boolean';
    }
    return 'string';
  }

  /**
   * Convierte un valor JS a literal TS para serializar en environment.ts.
   * @param {unknown} value
   * @returns {string}
   */
  toTypeScriptLiteral(value) {
    if (typeof value === 'string') {
      return JSON.stringify(value);
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    if (value === null) {
      return 'null';
    }
    if (Array.isArray(value) || typeof value === 'object') {
      return JSON.stringify(value);
    }
    throw new TypeError(
      `Tipo no soportado para serialización: ${typeof value}`,
    );
  }

  /**
   * Construye líneas de propiedades para serialización en environment.ts.
   * @returns {string}
   */
  buildEnvironmentProperties() {
    return Object.entries(this.config)
      .map(
        ([propertyName, propertyValue]) =>
          `  ${propertyName}: ${this.toTypeScriptLiteral(propertyValue)},`,
      )
      .join('\n');
  }

  /**
   * Construye líneas de propiedades para la interfaz de TypeScript.
   * @returns {string}
   */
  buildInterfaceProperties() {
    return Object.entries(this.config)
      .map(([propertyName, propertyValue]) => {
        const tsType = this.inferTypeScriptTypeFromValue(propertyValue);
        return `  ${propertyName}: ${tsType};`;
      })
      .join('\n');
  }

  /**
   * Construye líneas para mostrar configuración procesada en consola.
   * @returns {string[]}
   */
  buildConsoleConfigLines() {
    return Object.entries(this.config).map(([propertyName, propertyValue]) => {
      const label = propertyName
        .replaceAll(/([A-Z])/g, ' $1')
        .replace(/^./, (character) => character.toUpperCase());
      return `   - ${label}: ${propertyValue}`;
    });
  }

  /**
   * Carga las variables de entorno desde archivos .env
   * @returns {Object} Configuración cargada
   */
  loadEnvironments() {
    try {
      dotenv.config({ override: true });
      this.nodeEnv = env.get('NODE_ENV').default('DEV').asEnum(['DEV', 'PROD']);
      this.config = {};

      for (const [propertyName, resolver] of Object.entries(
        this.variableDefinitions,
      )) {
        if (typeof resolver !== 'function') {
          throw new TypeError(
            `La definición de "${propertyName}" debe ser una función resolver`,
          );
        }

        this.config[propertyName] = resolver();
      }

      return this.config;
    } catch (err) {
      console.error(
        `${SYMBOLS.cross} Error al cargar variables de entorno:`,
        err.message,
      );
      throw err;
    }
  }

  /**
   * Genera el contenido del archivo environment.ts
   * @returns {String} Contenido formateado del archivo
   */
  generateEnvironmentFile() {
    if (!this.config || !this.nodeEnv) {
      throw new Error('Primero debe ejecutar loadEnvironments()');
    }

    // Generar contenido del archivo environment.ts
    const environmentContent = `import { Environment } from './environment.interface';

/**
 * Environment generado automáticamente
 * ⚠️ Este archivo es generado automáticamente por load-env.js
 * No editar manualmente. Modificar el archivo .env correspondiente.
 *
 * Ambiente: ${this.nodeEnv}
 * Generado: ${new Date().toISOString()}
 */
export const environment: Environment = {
  production: ${this.nodeEnv === 'PROD'},
${this.buildEnvironmentProperties()}
};
`;

    return environmentContent;
  }

  generateEnvironmentInterfaceFile() {
    if (!this.config || !this.nodeEnv) {
      throw new Error('Primero debe ejecutar loadEnvironments()');
    }

    // Generar contenido del archivo environment.interface.ts
    const environmentInterfaceContent = `/**
 * Environment interface generado automáticamente
 * ⚠️ No editar manualmente — modificar las variables en el archivo .env
 * Generado: ${new Date().toISOString()}
 */
export interface Environment {
  production: boolean;
${this.buildInterfaceProperties()}
}
`;

    return environmentInterfaceContent;
  }

  /**
   * Escribe el archivo environment.ts en la ruta especificada
   * @throws {Error} Si hay error al crear directorio o escribir archivo
   */
  writeEnvironmentFile() {
    try {
      // Validar que la configuración esté cargada
      if (!this.config) {
        throw new Error(
          'Configuration not loaded. Call loadEnvironments() first.',
        );
      }

      // Crear directorio si no existe
      if (!fs.existsSync(this.targetPath)) {
        fs.mkdirSync(this.targetPath, { recursive: true });
        console.info(
          COLORS.info,
          `${SYMBOLS.check} Directorio creado: ${this.targetPath}`,
        );
      }

      // Generar contenido del archivo environment.interface.ts
      const envInterfaceFileContent = this.generateEnvironmentInterfaceFile();
      const interfaceFilePath = path.join(
        this.targetPath,
        'environment.interface.ts',
      );
      fs.writeFileSync(interfaceFilePath, envInterfaceFileContent, 'utf-8');

      // Generar contenido del archivo environment.ts
      const envFileContent = this.generateEnvironmentFile();
      const filePath = path.join(this.targetPath, 'environment.ts');
      fs.writeFileSync(filePath, envFileContent, 'utf-8');

      console.info(
        COLORS.success,
        `${SYMBOLS.check} Archivo environment.interface.ts generado exitosamente`,
      );
      console.info(
        COLORS.success,
        `${SYMBOLS.check} Archivo environment.ts generado exitosamente`,
      );
      console.info(COLORS.info, `   Ubicación: ${filePath}`);
    } catch (err) {
      console.error(
        COLORS.error,
        `${SYMBOLS.cross} Error al escribir archivo de entorno: ${err.message}`,
      );
      throw err;
    }
  }

  /**
   * Ejecuta el proceso completo: cargar y escribir environments
   */
  execute() {
    console.log('\n📋 Iniciando carga de variables de entorno...');

    try {
      this.loadEnvironments();
      this.writeEnvironmentFile();

      console.log('\n✅ Environment cargado exitosamente');
      console.log('📝 Configuración:');
      console.log(`   - Ambiente: ${this.nodeEnv}`);
      for (const line of this.buildConsoleConfigLines()) {
        console.log(line);
      }
    } catch (_err) {
      console.error(_err);
      console.error('\n❌ Falló la carga de environments');
      process.exit(1);
    }
  }
}

const environmentSchema = {
  apiUrl: env.schema('API_URL').required().asUrlString(),
  entityRoot: env.schema('ENTITY_ROOT').required().asString(),
  fileUser: env.schema('FILE_AUTH_USERNAME').required().asString(),
  filePassword: env.schema('FILE_AUTH_PASSWORD').required().asString(),
  secretKey: env.schema('SECRET_KEY').required().asString(),
  mainEntityCode: env.schema('MAIN_ENTITY_CODE').required().asString(),
};

// Ejecutar
const manager = new EnvironmentManager();
manager.configureSchema(environmentSchema).execute();
