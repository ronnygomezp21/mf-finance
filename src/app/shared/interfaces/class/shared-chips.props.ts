import { EventEmitter, InputSignal } from '@angular/core';

export interface SharedChipsProps {
  /**
   * Lista de objetos que se usara para mostrar los chips.
   */
  chipsOptions: InputSignal<any[]>;
  /**
   * Propiedad del objeto a usar como etiqueta en la vista.
   */
  bindLabel?: InputSignal<string>;
  /**
   * Propiedad del objeto a usar como valor interno.
   */
  bindValue?: InputSignal<string>;

  /**
   * Emite un evento cuando se agrega o elimina un chip, devolviendo un array de los chips seleccionados.
   */
  changeEvent: EventEmitter<any>;
}
