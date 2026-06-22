import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validador de cédula ecuatoriana — Algoritmo Módulo 10
 *
 * Reglas:
 * 1. Exactamente 10 dígitos numéricos
 * 2. Primeros 2 dígitos = código de provincia (01–24 o 30)
 * 3. Tercer dígito < 6 (persona natural)
 * 4. Dígito verificador (posición 10) validado con Módulo 10
 */
export function cedulaEcuatorianaValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;

  // Debe tener exactamente 10 dígitos
  if (!/^\d{10}$/.test(value)) {
    return { cedulaInvalida: true };
  }

  const digits = value.split('').map(Number);

  // Código de provincia: 01–24 o 30
  const provincia = parseInt(value.substring(0, 2), 10);
  if ((provincia < 1 || provincia > 24) && provincia !== 30) {
    return { cedulaInvalida: true };
  }

  // Tercer dígito < 6 (persona natural)
  if (digits[2] >= 6) {
    return { cedulaInvalida: true };
  }

  // Algoritmo Módulo 10
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let resultado = digits[i] * coeficientes[i];
    if (resultado > 9) {
      resultado -= 9;
    }
    suma += resultado;
  }

  const digitoVerificador = (10 - (suma % 10)) % 10;

  if (digitoVerificador !== digits[9]) {
    return { cedulaInvalida: true };
  }

  return null;
}


/**
 * Validador de RUC ecuatoriano
 * - Persona Natural (3er dígito 0-5): Módulo 10
 * - Entidad Pública (3er dígito 6): Módulo 11, coeficientes [3,2,7,6,5,4,3,2], verificador en [8]
 * - Persona Jurídica (3er dígito 9): Módulo 11, coeficientes [4,3,2,7,6,5,4,3,2], verificador en [9]
 */
export function rucEcuatorianoValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;

  if (!/^\d{13}$/.test(value)) {
    return { rucInvalido: true };
  }

  const provincia = parseInt(value.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) {
    return { rucInvalido: true };
  }

  const establecimiento = value.substring(10, 13);
  if (establecimiento === '000') {
    return { rucInvalido: true };
  }

  const tercerDigito = parseInt(value[2], 10);

  if (tercerDigito <= 5) {
    // Persona Natural → Módulo 10
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let resultado = parseInt(value[i], 10) * coeficientes[i];
      if (resultado > 9) resultado -= 9;
      suma += resultado;
    }
    const verificador = (10 - (suma % 10)) % 10;
    if (verificador !== parseInt(value[9], 10)) {
      return { rucInvalido: true };
    }
    return null;
  }

  if (tercerDigito === 6) {
    // Entidad Pública → Módulo 11 (8 coeficientes, verificador en posición [8])
    const coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    for (let i = 0; i < 8; i++) {
      suma += parseInt(value[i], 10) * coeficientes[i];
    }
    const residuo = suma % 11;
    const verificador = residuo === 0 ? 0 : 11 - residuo;
    if (verificador !== parseInt(value[8], 10)) {
      return { rucInvalido: true };
    }
    return null;
  }

  if (tercerDigito === 9) {
    // Persona Jurídica → Módulo 11 (9 coeficientes, verificador en posición [9])
    const coeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      suma += parseInt(value[i], 10) * coeficientes[i];
    }
    const residuo = suma % 11;
    const verificador = residuo === 0 ? 0 : 11 - residuo;
    if (verificador !== parseInt(value[9], 10)) {
      return { rucInvalido: true };
    }
    return null;
  }

  // 3er dígito 7 u 8 — no son tipos válidos de RUC
  return { rucInvalido: true };
}

