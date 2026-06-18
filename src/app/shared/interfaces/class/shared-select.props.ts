import { EventEmitter } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ModeSelectEnum } from '../../enum';

export interface SharedSelectProps {
  /**
   * Emite un evento cuando se llega al final del scroll.
   */
  scrollToEnd: EventEmitter<any>;
  /**
   * Emite un evento cuando se está buscando en la lista.
   */
  searchingInList: EventEmitter<any>;
  /**
   * Emite un evento cuando se selecciona un valor.
   */
  getValue: EventEmitter<any>;
  /**
   * Función de búsqueda personalizada para filtrar la lista de opciones.
   */
  searchFn: ((term: string, item: any) => boolean) | null;
  /**
   * Texto a mostrar cuando no se encuentran resultados.
   */
  notFoundText?: string;
  /**
   * Modo de selección del componente (combo, chips, etc.).
   */
  isMode?: ModeSelectEnum;
  /**
   * Indica si el campo es requerido.
   */
  isRequired?: boolean;
  /**
   * Indica si el componente se encuentra cargando datos.
   */
  isLoading?: boolean;
  /**
   * Indica si se debe reiniciar el formulario.
   */
  isResetForm?: boolean;
  /**
   * Propiedad del objeto a usar como etiqueta en la vista.
   */
  bindLabel?: string;
  /**
   * Propiedad del objeto a usar como valor interno.
   */
  bindValue?: string;
  /**
   * Lista de opciones para el select.
   */
  listOptions?: any[];
  /**
   * Propiedad del objeto a usar para las etiquetas en modo chips.
   */
  chipsProperty?: string;
  /**
   * Datos a establecer en el componente.
   */
  setData?: any;
  /**
   * Etiqueta a mostrar para el componente.
   */
  label?: string;
  /**
   * Número total de elementos (puede ser útil para paginación).
   */
  total?: number;
  /**
   * Indica si el componente permite búsqueda.
   */
  searchable?: boolean;
  /**
   * Control para enlazar el componente select compartido con el formulario padre.
   * Esto permite que el control del formulario sea marcado como tocado y que los estados inválidos
   * se reflejen correctamente en la interfaz de usuario, permitiendo mensajes de validación y estilos.
   */
  control?: AbstractControl<FormControl>;
  /**
   * Longitud máxima permitida para el valor.
   */
  maxLength?: number | null;
  /**
   * Longitud mínima permitida para el valor.
   */
  minLength?: number | null;
  /**
   * Valor máximo permitido.
   */
  max?: number | null;
  /**
   * Valor mínimo permitido.
   */
  min?: number | null;
}
