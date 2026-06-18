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
