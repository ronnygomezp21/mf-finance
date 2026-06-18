import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PaginationEnum } from '@neocore/lib-components';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ModeSelectEnum } from '../../enum';
import { IPagination } from '../../interfaces/catalog.interface';

@Component({
  standalone: false,
  selector: 'mf-core-shared-select',
  templateUrl: './shared-select.component.html',
})
export class SharedSelectComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @ViewChild('dynamicWidth') dynamicWidth!: ElementRef;
  @Output() scrollToEnd: EventEmitter<IPagination> = new EventEmitter<any>();
  @Output() searchingInList: EventEmitter<IPagination> =
    new EventEmitter<any>();
  @Output() getValue: EventEmitter<any> = new EventEmitter<any>();
  @Input() searchFn: ((term: string, item: any) => boolean) | null = null;
  @Input() notFoundText: string = 'No se encontraron resultados';
  @Input() isMode: ModeSelectEnum = ModeSelectEnum.COMBO;
  errorMessage = input<string>();
  closeOnSelect = input<boolean>(true);
  deselectOnClick = input<boolean>(true);
  clearSearchOnAdd = input<boolean>(true);
  multiple = input<boolean>(false);
  @Input() isRequired: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() isResetForm: boolean = false;
  @Input() bindLabel: string = 'name';
  @Input() bindValue: string = 'id';
  @Input() listOptions: any[] = [];
  @Input() chipsProperty!: string;
  @Input() title: string = '';
  @Input() setData!: any;
  @Input() label!: string;
  @Input() total!: number;
  @Input() searchable: boolean = false;
  /**
   * Control to link the shared select component with the parent form.
   * This allows the form control to be marked as touched and invalid states
   * to be properly reflected in the UI, enabling validation messages and styles.
   */
  control = input<FormControl>();
  @Input() maxLength: number | null = null;
  @Input() minLength: number | null = null;
  @Input() max: number | null = null;
  @Input() min: number | null = null;

  zIndex = input<string>();
  focus: boolean = false;

  public modeSelectEnum = ModeSelectEnum;
  private readonly limitForChip = 10;
  public firstTime: boolean = false;
  public validOptions: any[] = [];
  public groupChips: any[] = [];
  limit = PaginationEnum.LIMIT;
  public form!: FormGroup;
  maxWidthLabel = 'auto';
  currentPage = 1;
  width = 0;
  search = '';
  private readonly resizeSubject = new Subject<void>();
  private readonly destroy$ = new Subject<void>();
  /**
   * Subject para realizar la búsqueda en el select pero con un debounce
   */
  private readonly searchSubject = new Subject<{
    term: string;
    items: any[];
  }>();

  // [AI-GENERATED | skill: mf-refactor-skill | Patr?n 18 | model: gemini-2-5-pro]
  private readonly formBuilder = inject(FormBuilder);

  constructor() {
    this.createForm();
  }

  ngOnInit(): void {
    // Suscribimos nuestro Subject con un debounce de 300ms (ajusta a tu necesidad)
    this.searchSubject.pipe(debounceTime(300)).subscribe((event) => {
      this._onSearchedDebounced(event);
    });
    // Si la lista está vacía, emitimos para cargar datos
    if (!this.listOptions || this.listOptions.length === 0) {
      this.scrollToEnd.emit({ page: this.currentPage, limit: this.limit });
    }
    // Configurar la suscripción al resize con debounce
    this.resizeSubject
      .pipe(debounceTime(1), takeUntil(this.destroy$))
      .subscribe(() => {
        this.handleResize();
      });
    this.resizeSubject.next();
    this.suscribesTo();
  }

  suscribesTo() {
    if (this.control()?.value !== this.form.get('form')?.value) {
      this.form.get('form')?.setValue(this.control()?.value);
    }
    this.control()?.valueChanges.subscribe({
      next: (res) => {
        if (res !== this.form.get('form')?.value) {
          this.form.get('form')?.setValue(this.control()?.value);
        }
      },
    });
  }

  ngDoCheck(): void {
    if (this.control()?.touched && !this.form.touched) {
      this.form.get('form')?.markAllAsTouched();
    }

    if (
      this.control()?.getError('required') &&
      !this.form.get('form')?.getError('required')
    ) {
      const controller = this.form.get('form');
      const control = this.control();
      if (controller && control) {
        this.copyValidators(control, controller);
      }
    }
    this.resizeSubject.next();
    if (this.control()?.disabled) {
      if (!this.form.disabled) {
        this.form.disable();
      }
    }
    if (this.control()?.enabled) {
      if (!this.form.enabled) {
        this.form.enable();
      }
    }
  }

  ngAfterViewInit(): void {
    this.onInitWidth();
  }

  onInitWidth() {
    setTimeout(() => this.resizeSubject.next(), 15);
    this.resizeSubject.next();
    window.addEventListener('resize', () => this.resizeSubject.next());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.resizeSubject.next());
    this.destroy$.next();
    this.destroy$.complete();
  }
  private getDivWidth(): number {
    const extraSpace = 25;
    if (
      this.focus ||
      this.form.controls['form'].getRawValue() ||
      this.control()?.getRawValue()
    ) {
      return (this.dynamicWidth?.nativeElement?.offsetWidth ?? 0) + extraSpace;
    } else {
      return this.dynamicWidth?.nativeElement?.offsetWidth ?? 0;
    }
  }

  private readonly handleResize = (): void => {
    const currentWidth = this.getDivWidth();
    if (currentWidth !== this.width) {
      this.width = currentWidth;
      this.onWidthChange(currentWidth);
    }
  };

  onWidthChange(width: number): void {
    const iconSpace = 25;
    const leftSpace = 12;
    const space = width - iconSpace - leftSpace;
    this.maxWidthLabel = space > 0 ? `${space}px` : 'auto';
  }

  copyValidators(
    source: AbstractControl<FormControl>,
    destination: AbstractControl<FormControl>,
  ): void {
    const validators = source.validator ? [source.validator] : [];
    destination.setValidators(validators);
    destination.updateValueAndValidity(); // Trigger validation
  }

  requiredForm() {
    this.form.get('form')?.setValidators([Validators.required]);
    this.form.get('form')?.updateValueAndValidity();
  }

  updateValidators(validator: ValidatorFn) {
    let currentValidation: any[] = [];
    if (this.form.get('form')?.validator) {
      currentValidation = [this.form.get('form')?.validator];
    }

    const newValidators = [validator];

    const combinedValidator = combineValidators(
      ...currentValidation,
      ...newValidators,
    );

    this.form.get('form')?.setValidators(combinedValidator);
    this.form.get('form')?.updateValueAndValidity();
  }

  isArray(arg: any[]) {
    return Array.isArray(arg);
  }

  minForm() {
    if (this.min) {
      this.form.get('form')?.setValidators([Validators.min(this.min)]);
      this.form.get('form')?.updateValueAndValidity();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['min']?.currentValue) {
      if (this.min) {
        this.updateValidators(Validators.min(this.min));
      }
    }
    if (changes['max']?.currentValue) {
      if (this.max) {
        this.updateValidators(Validators.max(this.max));
      }
    }

    if (changes['minLength']?.currentValue) {
      if (this.minLength) {
        this.updateValidators(Validators.minLength(this.minLength));
      }
    }

    if (changes['maxLength']?.currentValue) {
      if (this.maxLength) {
        this.updateValidators(Validators.maxLength(this.maxLength));
      }
    }

    if (changes['isRequired']?.currentValue) {
      this.requiredForm();
      if (this.isRequired) {
        this.updateValidators(Validators.required);
      }
    }

    if (changes['isResetForm']?.currentValue) {
      if (this.isResetForm) {
        this.resetForm();
      }
    }

    if (changes['setData']?.currentValue) {
      this.setDataForm(this.setData);
    }

    if (changes['listOptions']?.currentValue) {
      this.filterValidOptions(this.listOptions);
    }
  }

  filterValidOptions(options: any[]) {
    this.validOptions = options.filter((f) => {
      if (f[this.bindValue] && f[this.bindLabel]) {
        return f;
      }
    });
    if (this.control()?.value) {
      this.form.get('form')?.reset();
      this.form.get('form')?.setValue(this.control()?.value);
      this.form.get('form')?.updateValueAndValidity();
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      form: [null],
    });
  }

  resetForm() {
    this.form.reset();
  }

  private currentTotal = 0;
  private previousTotal = 0;
  /**
   * Cuando el usuario se desplaza hasta el final de la lista, emitirá un evento para cargar más datos
   */
  onScrollToEndLoading() {
    /**
     * Si la cantidad de elementos en la lista es la misma que la anterior, entonces no hace la petición
     * esto quiere decir que ya no hay más elementos para cargar
     */
    const reachedEnd =
      this.currentTotal &&
      this.previousTotal &&
      this.currentTotal === this.previousTotal;
    if (reachedEnd) {
      return;
    }
    this.currentPage++;
    this.scrollToEnd.emit({
      page: this.currentPage,
      limit: this.limit,
      search: this.search,
    });

    this.previousTotal = this.currentTotal;
    this.currentTotal = this.validOptions.length;
  }

  /**
   * Buscar elementos en la lista para un término dado
   * si los elementos se encuentran en la lista, entonces intentará emitir un
   * evento para buscar en el backend
   * @param event
   */
  onSearched(event: { term: string; items: any[] }) {
    // En lugar de emitir inmediatamente, enviamos al Subject
    this.searchSubject.next(event);
  }

  private _onSearchedDebounced(event: { term: string; items: any[] }) {
    const search = event.term;
    // Si el término de búsqueda es el mismo, no hace la petición
    if (this.search === search) {
      return;
    }
    this.search = search;
    // reset page, etc.
    if (this.currentPage !== 1) {
      this.currentPage = 1;
    }
    // Si hay una cantidad considerable de elementos en memoria, no hace la petición
    const tooLittleItems = event.items.length < 3;
    if (!tooLittleItems) {
      return;
    }
    this.searchingInList.emit({
      search: this.search,
      page: this.currentPage,
      limit: this.limit,
    });
  }

  setDataForm(data: any) {
    switch (this.isMode) {
      case ModeSelectEnum.COMBO:
        this.form.get('form')?.setValue(data);
        this.getValue.emit(data);
        break;

      case ModeSelectEnum.CHIPS:
      case ModeSelectEnum.MIX: {
        if (this.setData) {
          data.forEach((element: any) => {
            const found = this.groupChips.filter((elem) => {
              if (element[this.bindValue] === elem[this.bindValue]) {
                return elem;
              }
            });
            if (found.length === 0) {
              this.groupChips.push(element);
            }
          });
          if (Array.isArray(data)) {
            this.form.get('form')?.setValue(data[0]);
          } else {
            this.form.get('form')?.setValue(data);
          }
          this.getValue.emit(this.groupChips);
        }
      }
    }
  }

  pushChips(value: any) {
    if (value) {
      switch (this.isMode) {
        case ModeSelectEnum.COMBO:
          this.control()?.setValue(value[this.bindValue]);
          this.getValue.emit(value[this.bindValue]);
          break;

        case ModeSelectEnum.CHIPS:
        case ModeSelectEnum.MIX: {
          const found = this.groupChips?.filter((e) => {
            const elem = e[this.bindValue];
            const val = value[this.bindValue];
            if (elem === val) {
              return e;
            }
          });

          if (found?.length === 0) {
            this.groupChips?.push(value);
            this.getValue.emit(this.groupChips);
          }
          break;
        }
      }
    } else {
      this.getValue.emit();
      this.control()?.setValue(null);
    }
  }

  deleteChip(element: any) {
    this.groupChips = this.groupChips?.filter(
      (item: any) => item[this.bindValue] !== element[this.bindValue],
    );
    this.getValue.emit(this.groupChips);
  }

  validateDataPush(value: any) {
    if (
      this.isMode === ModeSelectEnum.CHIPS ||
      (this.isMode === ModeSelectEnum.MIX &&
        this.listOptions.length < this.limitForChip)
    ) {
      const findChipValue = this.validateChip(value);
      if (findChipValue) {
        this.deleteChip(value);
      } else {
        this.pushChips(value);
      }
    }
  }

  validateChip(chip: any): boolean {
    const findChipValue = this.groupChips?.filter(
      (f) => f[this.bindValue] === chip[this.bindValue],
    );
    if (findChipValue?.length > 0) {
      return true;
    }
    return false;
  }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
  }
}

function combineValidators(...validators: ValidatorFn[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return validators.reduce((errors, validator) => {
      const validationErrors = validator(control);
      return validationErrors ? { ...errors, ...validationErrors } : errors;
    }, {});
  };
}
