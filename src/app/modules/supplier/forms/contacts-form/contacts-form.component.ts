import { Component, inject, input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONTACT_TYPES, PHONE_TYPES } from '../../constants/supplier-catalogs';

@Component({
  selector: 'mf-finance-supplier-contacts-form',
  standalone: false,
  templateUrl: './contacts-form.component.html',
  styleUrls: ['./contacts-form.component.scss'],
})
export class ContactsFormComponent {
  private readonly fb = inject(FormBuilder);

  form = input.required<FormGroup>();


  readonly contactTypes = CONTACT_TYPES;
  readonly phoneTypes = PHONE_TYPES;

  /** ID del tipo de contacto por defecto: Retención */
  readonly defaultContactTypeId = 2;

  get contactsArray(): FormArray {
    return this.form().get('contacts') as FormArray;
  }

  addContact(): void {
    this.contactsArray.push(this.fb.group({
      contactType: [this.defaultContactTypeId, Validators.required],
      name: ['', Validators.required],
      position: [''],
      phoneType: [null],
      phoneNumber: [''],
      email1: ['', [Validators.required, Validators.email]],
      email2: [''],
    }));
  }

  removeContact(index: number): void {
    if (index > 0) {
      this.contactsArray.removeAt(index);
    }
  }

  // [BUGFIX #003] Si phoneType tiene valor → phoneNumber obligatorio
  onPhoneTypeChange(index: number): void {
    const contact = this.contactsArray.at(index) as FormGroup;
    const phoneType = contact.get('phoneType')?.value;
    if (phoneType) {
      contact.get('phoneNumber')?.setValidators([Validators.required]);
    } else {
      contact.get('phoneNumber')?.clearValidators();
    }
    contact.get('phoneNumber')?.updateValueAndValidity();
  }
}
