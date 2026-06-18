import { Component, effect, input, OnInit, output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { JUSTIFY_CONTENT_ALIGN_OBJECT } from '../../constants/scss/scss.constant';
import { ModeShipEnum } from '../../enum/scss/shared-chips.enum';
import { JustifyContentType } from '../../interfaces/scss/scss.interface';

@Component({
  standalone: false,
  selector: 'mf-core-shared-chips',
  templateUrl: './shared-chips.component.html',
})
export class SharedChipsComponent implements OnInit {
  alignContent = input<JustifyContentType>('Start');
  mode = input<ModeShipEnum>(ModeShipEnum.NORMAL);
  chipsOptions = input.required<FormArray<FormGroup>>();
  bindLabel = input<string>('name');
  bindValue = input<string>('id');
  chipsHide = input<string>('');
  /**
   * si es false simplemente hace toggle del selected
   * si es true, lo que deberia hacer el seleccionar o deseleccionar queda delegado al metodo
   * deleteOption, que emite el chip seleccionado
   */
  confirmationMode = input<boolean>(false);
  customClass = input<string>('');
  iconCheckedChips = input<string>('svg-funciones-check');
  useAlternativeStyles = input<boolean>(false);

  changeEvent = output<any>();
  deleteOption = output<any>();

  justifyContentObject = JUSTIFY_CONTENT_ALIGN_OBJECT;

  constructor() {
    effect(() => this.effectOnChips());
  }

  ngOnInit(): void {
    this.chipsOptions().valueChanges.subscribe(() => this.effectOnChips());
  }

  effectOnChips() {
    if (this.chipsOptions() instanceof FormArray) {
      this.chipsOptions().controls?.forEach((chip) => {
        if (!chip.get('selected')) {
          chip.addControl('selected', new FormControl(true));
          chip.updateValueAndValidity();
        }
      });
    }
  }

  onSelected(chip: FormGroup) {
    const selected = chip?.value;

    if (this.confirmationMode()) {
      this.deleteOption.emit(selected);
    } else {
      // de esta forma no estaba haciendo toggle, pero si pasa algo dejelo con este codigo: chip.get('selected')?.setValue(!selected);
      chip.get('selected')?.setValue(!chip.get('selected')?.value);
    }
  }
}
