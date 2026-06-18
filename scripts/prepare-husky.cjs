const fs = require('node:fs');
const { execSync } = require('node:child_process');
const path = require('node:path');

const huskyDir = path.join(__dirname, '..', '.husky');
const preCommitFile = path.join(huskyDir, 'pre-commit');
const envFilePath = path.join(__dirname, '..', '.env');
const GGA_ENV_FLAG = 'GGA_REVIEWER';
const ENV_KEY_PATTERN = /^(?!\d)\w+$/;

function findSeparatorIndex(line) {
  const equalsIndex = line.indexOf('=');
  const colonIndex = line.indexOf(':');

  if (equalsIndex === -1) {
    return colonIndex;
  }

  if (colonIndex === -1) {
    return equalsIndex;
  }

  return Math.min(equalsIndex, colonIndex);
}

function stripWrappingQuotes(value) {
  const hasDoubleQuotes = value.startsWith('"') && value.endsWith('"');
  const hasSingleQuotes = value.startsWith("'") && value.endsWith("'");

  if (value.length >= 2 && (hasDoubleQuotes || hasSingleQuotes)) {
    return value.slice(1, -1);
  }

  return value;
}

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  const separatorIndex = findSeparatorIndex(trimmed);
  if (separatorIndex <= 0) {
    return null;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  if (!ENV_KEY_PATTERN.test(key)) {
    return null;
  }

  const rawValue = trimmed.slice(separatorIndex + 1).trim();
  return [key, stripWrappingQuotes(rawValue)];
}

function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const parsed = {};

    for (const line of content.split(/\r?\n/)) {
      const parsedLine = parseEnvLine(line);
      if (!parsedLine) {
        continue;
      }

      const [key, value] = parsedLine;
      parsed[key] = value;
    }

    return parsed;
  } catch (error) {
    console.warn(
      `[prepare-husky] Unable to read/parse env file (${filePath}): ${error.message}`,
    );
    return {};
  }
}

function parseBooleanFlag(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === 'enabled';
}

const fileEnv = parseEnvFile(envFilePath);
const shouldRunGga = parseBooleanFlag(
  process.env[GGA_ENV_FLAG] ?? fileEnv[GGA_ENV_FLAG],
);

// Helper to safely run a command, return true if success
function safeExec(cmd, opts = {}) {
  try {
    execSync(cmd, { stdio: 'ignore', ...opts });
    return true;
  } catch (_err) {
    console.error(`Command failed: ${cmd}`, _err);
    return false;
  }
}

// Only try to install husky if git and npx are present
const hasGit = safeExec('git --version');
const hasNpx = safeExec('npx --version');

if (hasGit && hasNpx) {
  try {
    // Run husky install (this will create .husky directory)
    execSync('npx husky', { stdio: 'inherit' });
  } catch (error) {
    // ignore; we run in environments where npx may be present but commands fail
    console.error('Failed to run husky install:', error.message || error);
  }
} else {
  // If not available, print a short note for debugging but don't fail the build
  if (!hasNpx) console.info('npx not found: skipping husky install');
  if (!hasGit) console.info('git not found: skipping husky install');
}

// Ensure husky dir exists so writing pre-commit won't fail
try {
  fs.mkdirSync(huskyDir, { recursive: true });
} catch (_err) {
  console.error('Failed to create husky directory:', _err);
}

// Create/overwrite pre-commit file with lint-staged command
// Compatible con Husky v9+ y v10 (sin líneas deprecadas)
try {
  const ggaSection = shouldRunGga
    ? `# ======== GGA START ========
# Gentleman Guardian Angel - AI Review first (uses git staged files internally)
gga run || exit 1
# ======== GGA END ========

`
    : '# GGA deshabilitado (GGA_REVIEWER != enabled)\n\n';

  const preCommitContent = `
#!/usr/bin/env bash
# Pre-commit hook: Validación de código con Lint-staged
#
# Para análisis de SonarQube, ejecuta manualmente:
#   bun run sonar
${ggaSection}

# Este hook ejecuta lint-staged para validar formato, linting y prettier
# en los archivos modificados antes de hacer commit.
npx lint-staged
`;
  fs.writeFileSync(preCommitFile, preCommitContent, { encoding: 'utf8' });
  console.log(
    `✅ Pre-commit hook configurado con lint-staged (Husky v9+) | GGA ${
      shouldRunGga ? 'habilitado' : 'omitido'
    } vía ${GGA_ENV_FLAG}`,
  );
} catch (err) {
  // nothing to do, we must not fail the build
  console.error('Failed to write pre-commit hook:', err.message || err);
}

// Make executable on non-Windows platforms
if (process.platform !== 'win32') {
  try {
    if (safeExec(`chmod +x "${preCommitFile}"`)) {
      // success
    }
  } catch (error) {
    console.error(
      'Failed to make pre-commit executable:',
      error.message || error,
    );
  }
}
