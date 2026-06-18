/**
 * Lightweight environment variable helper
 * Replaces env-var dependency with minimal footprint
 * Only includes methods required by load-env.js
 *
 * Usage: env.get("VAR_NAME").default("value").asString()
 */

/**
 * Validates if a URL is valid
 * @param {string} url URL to validate
 * @returns {boolean} true if valid
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates if a value is a plain object (and not array/null).
 * @param {unknown} value Value to validate
 * @returns {boolean} true when value is a plain object
 */
function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value) === false
  );
}

/**
 * Creates an environment variable validator/parser
 * @param {string} varName Variable name
 * @returns {object} Validator object with chainable methods
 */
function createEnvVar(varName) {
  const value = process.env[varName];

  const resolveValue = (currentValue) =>
    currentValue === undefined ? value : currentValue;

  const ensureDefined = (currentValue) => {
    if (currentValue === undefined || currentValue === '') {
      throw new Error(`Environment variable "${varName}" is not defined`);
    }
  };

  return {
    /**
     * Set default value if variable is not defined
     * @param {string} defaultValue Default value
     * @returns {object} Chainable validator
     */
    default(defaultValue) {
      this._value = value === undefined ? defaultValue : value;
      return this;
    },

    /**
     * Mark variable as required (throw error if undefined)
     * @returns {object} Chainable validator
     */
    required() {
      if (value === undefined || value === '') {
        throw new Error(
          `Required environment variable "${varName}" is not defined`,
        );
      }
      this._value = value;
      return this;
    },

    /**
     * Parse as string
     * @returns {string} Parsed value
     */
    asString() {
      const finalValue = resolveValue(this._value);
      ensureDefined(finalValue);
      return String(finalValue);
    },

    /**
     * Parse as URL string with validation
     * @returns {string} Validated URL
     */
    asUrlString() {
      const finalValue = resolveValue(this._value);
      ensureDefined(finalValue);
      const urlString = String(finalValue);
      if (isValidUrl(urlString) === false) {
        throw new TypeError(
          `Environment variable "${varName}" is not a valid URL: ${urlString}`,
        );
      }
      return urlString;
    },

    /**
     * Parse as enum (validate against allowed values)
     * @param {string[]} allowedValues Allowed values
     * @returns {string} Validated enum value
     */
    asEnum(allowedValues) {
      const finalValue = resolveValue(this._value);
      ensureDefined(finalValue);
      const strValue = String(finalValue);
      if (allowedValues.includes(strValue) === false) {
        throw new TypeError(
          `Environment variable "${varName}" must be one of [${allowedValues.join(
            ', ',
          )}], got: ${strValue}`,
        );
      }
      return strValue;
    },

    /**
     * Parse as boolean
     * @returns {boolean} Parsed boolean value
     */
    asBool() {
      const finalValue = resolveValue(this._value);
      ensureDefined(finalValue);
      const strValue = String(finalValue).toLowerCase().trim();

      // Handle truthy values
      if (['true', '1', 'yes', 'y', 'on'].includes(strValue)) {
        return true;
      }
      // Handle falsy values
      if (['false', '0', 'no', 'n', 'off'].includes(strValue)) {
        return false;
      }

      throw new TypeError(
        `Environment variable "${varName}" must be a boolean value (true/false, 1/0, yes/no, y/n, on/off), got: ${finalValue}`,
      );
    },

    /**
     * Parse as boolean (alias for asBool)
     * @returns {boolean} Parsed boolean value
     */
    asBoolStrict() {
      return this.asBool();
    },

    /**
     * Parse as integer
     * @returns {number} Parsed integer
     */
    asInt() {
      const finalValue = resolveValue(this._value);
      ensureDefined(finalValue);
      const num = Number.parseInt(String(finalValue), 10);
      if (Number.isNaN(num)) {
        throw new TypeError(
          `Environment variable "${varName}" must be an integer, got: ${finalValue}`,
        );
      }
      return num;
    },

    /**
     * Parse as positive integer
     * @returns {number} Parsed positive integer
     */
    asIntPositive() {
      const num = this.asInt();
      if (num <= 0) {
        throw new Error(
          `Environment variable "${varName}" must be a positive integer, got: ${num}`,
        );
      }
      return num;
    },

    /**
     * Parse as float/number
     * @returns {number} Parsed number
     */
    asFloat() {
      const finalValue = resolveValue(this._value);
      ensureDefined(finalValue);
      const num = Number.parseFloat(String(finalValue));
      if (Number.isNaN(num)) {
        throw new TypeError(
          `Environment variable "${varName}" must be a number, got: ${finalValue}`,
        );
      }
      return num;
    },

    /**
     * Parse as positive float
     * @returns {number} Parsed positive float
     */
    asFloatPositive() {
      const num = this.asFloat();
      if (num <= 0) {
        throw new Error(
          `Environment variable "${varName}" must be a positive number, got: ${num}`,
        );
      }
      return num;
    },

    /**
     * Get the current value (for chaining without final conversion)
     * @returns {*} Current value
     */
    _getValue() {
      return resolveValue(this._value);
    },
  };
}

/**
 * Creates a lazy schema builder that defers env parsing until execution time.
 * This allows defining schema objects before dotenv.config() is called.
 *
 * Usage:
 * const schema = {
 *   apiUrl: env.schema('API_URL').required().asUrlString(),
 *   timeoutMs: env.schema('TIMEOUT_MS').default('3000').asIntPositive(),
 * };
 *
 * Later, execute each resolver function to get parsed values.
 * @param {string} varName Variable name
 * @returns {object} Chainable lazy parser that returns a resolver function on final parser methods
 */
function createSchemaVar(varName) {
  const steps = [];

  const buildResolver = () => {
    return () => {
      let chain = createEnvVar(varName);

      for (const [methodName, methodArgs] of steps) {
        if (typeof chain[methodName] !== 'function') {
          throw new TypeError(
            `Environment helper method "${methodName}" is not available for "${varName}"`,
          );
        }
        chain = chain[methodName](...methodArgs);
      }

      return chain;
    };
  };

  const api = {
    default(defaultValue) {
      steps.push(['default', [defaultValue]]);
      return api;
    },

    required() {
      steps.push(['required', []]);
      return api;
    },

    asString() {
      steps.push(['asString', []]);
      return buildResolver();
    },

    asUrlString() {
      steps.push(['asUrlString', []]);
      return buildResolver();
    },

    asEnum(allowedValues) {
      steps.push(['asEnum', [allowedValues]]);
      return buildResolver();
    },

    asBool() {
      steps.push(['asBool', []]);
      return buildResolver();
    },

    asBoolStrict() {
      steps.push(['asBoolStrict', []]);
      return buildResolver();
    },

    asInt() {
      steps.push(['asInt', []]);
      return buildResolver();
    },

    asIntPositive() {
      steps.push(['asIntPositive', []]);
      return buildResolver();
    },

    asFloat() {
      steps.push(['asFloat', []]);
      return buildResolver();
    },

    asFloatPositive() {
      steps.push(['asFloatPositive', []]);
      return buildResolver();
    },
  };

  return api;
}

/**
 * Resolves a schema node recursively.
 * A schema node can be:
 * - Resolver function (() => unknown)
 * - Nested plain object with more schema nodes
 *
 * @param {unknown} schemaNode Schema node definition
 * @param {string} schemaPath Current node path for error messages
 * @returns {unknown} Parsed schema value
 */
function resolveSchemaNode(schemaNode, schemaPath) {
  if (typeof schemaNode === 'function') {
    return schemaNode();
  }

  if (isPlainObject(schemaNode)) {
    const resolved = {};

    for (const [propertyName, propertyDefinition] of Object.entries(
      schemaNode,
    )) {
      const propertyPath = `${schemaPath}.${propertyName}`;
      resolved[propertyName] = resolveSchemaNode(
        propertyDefinition,
        propertyPath,
      );
    }

    return resolved;
  }

  throw new TypeError(
    `Invalid schema definition at "${schemaPath}". Expected a resolver function or nested object.`,
  );
}

/**
 * Main env object with get() method (compatible with env-var API)
 */
const env = {
  /**
   * Get an environment variable validator/parser
   * @param {string} varName Variable name
   * @returns {object} Validator object
   */
  get(varName) {
    return createEnvVar(varName);
  },

  /**
   * Get a lazy schema variable builder (env-var-like API).
   * Final parser methods return a resolver function.
   * @param {string} varName Variable name
   * @returns {object} Chainable schema builder
   */
  schema(varName) {
    return createSchemaVar(varName);
  },

  /**
   * Resolve and validate a schema object recursively.
   * Supports nested objects with resolver functions as leaf nodes.
   *
   * @param {Record<string, unknown>} schemaDefinition Schema object
   * @returns {Record<string, unknown>} Parsed configuration object
   */
  resolveSchema(schemaDefinition) {
    if (!isPlainObject(schemaDefinition)) {
      throw new TypeError('schemaDefinition must be a plain object');
    }

    return resolveSchemaNode(schemaDefinition, 'schema');
  },
};

module.exports = env;
