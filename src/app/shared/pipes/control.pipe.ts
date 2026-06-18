import { Pipe, PipeTransform } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

/**
 * Pipe para obtener un control de formulario específico desde un FormGroup.
 * Facilita el acceso a controles individuales en plantillas de Angular.
 *
 * @example
 * <!-- Acceso a un control de nivel superior -->
 * <input [formControl]="formulario | control:'nombre'">
 *
 * <!-- Acceso a un control dentro de un subgrupo -->
 * <input [formControl]="formulario | control:'direccion.calle'">
 *
 * <!-- Acceso a un elemento de un FormArray -->
 * <input [formControl]="formulario | control:'contactos[0].nombre'">
 *
 * <!-- Acceder a un control dentro de un subgrupo especificando la ruta completa -->
 * <input [formControl]="formulario | control:'calle' : 'direccion'">
 */
@Pipe({
  name: 'control',
  standalone: true,
})
export class ControlPipe implements PipeTransform {
  /**
   * Extrae un control específico de un FormGroup.
   *
   * @param formGroup - El grupo de formularios del que se extraerá el control
   * @param controlName - El nombre del control a extraer
   * @param subgroupPath - (Opcional) Ruta al subgrupo que contiene el control
   * @returns El FormControl correspondiente al nombre especificado
   */
  transform(
    formGroup: FormGroup,
    controlName: string,
    subgroupPath?: string,
  ): FormControl {
    if (!formGroup) {
      console.error('The form Group is invalid or does not exist.');
    }

    // Si se proporciona una ruta de subgrupo
    if (subgroupPath) {
      // Navegar al subgrupo
      const subgroup = this.navigatePath(formGroup, subgroupPath);

      if (subgroup instanceof FormGroup) {
        return subgroup.get(controlName) as FormControl;
      } else {
        console.warn(
          `El subgrupo '${subgroupPath}' no existe o no es un FormGroup`,
        );
      }
    }

    // Comprobar si el controlName contiene notación de punto (ej: 'direccion.calle')
    if (controlName.includes('.') || controlName.includes('[')) {
      return this.navigatePath(formGroup, controlName) as FormControl;
    }

    // Caso estándar para un control de nivel superior
    return formGroup.get(controlName) as FormControl;
  }

  /**
   * Navega a través de una ruta de control compleja que puede incluir FormGroups y FormArrays
   *
   * @param control - El control desde el que se inicia la navegación
   * @param path - La ruta a seguir (ej: 'direccion.calle', 'contactos[0].nombre')
   * @returns El control encontrado al final de la ruta
   */
  private navigatePath(
    control: AbstractControl,
    path: string,
  ): AbstractControl {
    // Expresión regular para dividir correctamente la ruta con FormArrays
    const segments = path.match(/[^\.\[\]]+|\[\d+\]/g) || [];

    let current: AbstractControl<any> = control;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      // Si es un índice de array como [0]
      if (segment.match(/^\[\d+\]$/)) {
        const index = parseInt(segment.substring(1, segment.length - 1));

        if (!(current instanceof FormArray)) {
          console.warn(`Se esperaba un FormArray para el índice ${segment}`);
        }

        current = (current as FormArray).at(index);
      }
      // Si es un segmento que contiene un índice de array como 'contactos[0]'
      else if (segment.includes('[')) {
        const [arrayName, indexPart] = segment.split('[');
        const index = parseInt(indexPart);

        const array = current.get(arrayName);

        if (!(array instanceof FormArray)) {
          console.warn(`'${arrayName}' no es un FormArray válido`);
        }

        current = (array as FormArray).at(index);
      }
      // Segmento normal para FormGroup
      else {
        if (i === segments.length - 1) {
          // Es el último segmento, puede ser cualquier tipo de control
          return current.get(segment) as FormControl;
        }

        const nextControl = current.get(segment);
        if (!nextControl) {
          console.warn(
            `No se encontró el segmento '${segment}' en la ruta '${path}'`,
          );
          break;
        }
        current = nextControl;
      }

      if (!current) {
        console.warn(
          `No se encontró el segmento '${segment}' en la ruta '${path}'`,
        );
      }
    }

    return current;
  }
}
