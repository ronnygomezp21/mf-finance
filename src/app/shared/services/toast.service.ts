import { Injectable } from '@angular/core';
import Pubsub from 'pubsub-js';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}

  /**
   * Lanza un toast de Éxito
   * @param message pasar un path valido del json de translate
   */
  success(message: string = 'Consulta realizada con éxito') {
    Pubsub.publish('success', message);
  }

  /**
   * Lanza un toast de error
   * @param message pasar un path valido del json de translate
   */
  error(message: string) {
    Pubsub.publish('error', message);
  }

  /**
   * Lanza un toast de advertencia
   * @param message pasar un path valido del json de translate
   */
  warning(message: string) {
    Pubsub.publish('warning', message);
  }

  info(message: string) {
    Pubsub.publish('info', message);
  }
}
