import {
  Component,
  EventEmitter,
  Input,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import {
  ActionI,
  TableColumnDataI,
  TableLimitI,
} from '../../interfaces/general.interface';

@Component({
  standalone: false,
  selector: 'mf-core-shared-table',
  templateUrl: './shared-table.component.html',
})
export class SharedTableComponent implements OnInit {
  @Input() paginate: boolean = true;
  @Input() filter: boolean = true;
  @Input() button: boolean = true;
  @Input() optionsFilter: boolean = true;
  @Input() useCards: boolean = true;
  @Input() validAction: boolean = true;
  @Input() tableColumns: TableColumnDataI[] = [];
  @Input() tableData: any[] = [];
  @Input() addButtonStyle: 'Primary' | 'Secondary' = 'Primary';
  @Input() addButton: string = '';
  @Input() tableActions: string[] = [];
  @Input() status!: boolean | null;
  @Input() limit!: number;
  @Input() total!: number;
  @Input() page!: number;
  @Output() redirectAddForm: string = '';
  @Output() evenEmitterButtonAdd: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() listFilterEvent: EventEmitter<boolean | null> = new EventEmitter<
    boolean | null
  >();
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() limitAction: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageNumberAction: EventEmitter<number> = new EventEmitter<number>();
  @Output() searchTermEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() eventOpenModalFilter: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  searchValue: string = '';
  public searchForm: FormGroup;
  public originalArray: any[] = [];
  public sortOrder: string = 'asc'; // inicializa el orden de la columna
  public lastIndexOrder: string = '';

  public limitPagination: TableLimitI[] = [
    { label: '10 registros por página', value: 10 },
    { label: '20 registros por página', value: 20 },
    { label: '50 registros por página', value: 50 },
    { label: '100 registros por página', value: 100 },
  ];

  toggleActionsRow: any = {};

  // [AI-GENERATED | skill: mf-refactor-skill | Patr?n 18 | model: gemini-2-5-pro]
  private readonly formBuilder = inject(FormBuilder);

  constructor() {
    this.createForm();
  }

  ngOnInit() {
    this.searchForm.valueChanges
      .pipe(debounceTime(700))
      .subscribe((newValue) => {
        this.searchValue = newValue.search;
        this.searchEvent();
      });
  }

  createForm() {
    this.searchForm = this.formBuilder.group({
      search: [''],
    });
  }

  emitAddFormEvent() {
    this.evenEmitterButtonAdd.emit(true);
  }

  emitOnChangeStatus(status: boolean | null) {
    this.listFilterEvent.emit(status);
  }

  emitRowAction(element: object, iconName: string) {
    const data: ActionI = {
      actionName: iconName,
      data: element,
    };
    this.rowAction.emit(data);
  }

  emitLimitTableEvent(event: any) {
    this.limitAction.emit(event.target.value);
  }

  pageChange(event: number) {
    this.pageNumberAction.emit(event);
  }

  searchEvent() {
    this.searchTermEvent.emit(this.searchValue);
  }

  resetSearch() {
    this.searchValue = '';
    this.searchForm.get('search')?.setValue('');
  }

  emitOpenFilterModal() {
    this.eventOpenModalFilter.emit(true);
  }

  findActions(): boolean {
    const findActionsDrop = this.tableActions.find(
      (f) => f != 'disable' && f != 'rol' && f != 'block',
    );

    if (findActionsDrop) {
      return true;
    }

    return false;
  }

  getStringJson(json: any): string {
    return JSON.stringify(json);
  }

  sortTable(dataKey: string) {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

    if (this.lastIndexOrder != dataKey) {
      this.lastIndexOrder = dataKey;
      this.sortOrder = 'asc';
    }

    this.tableData.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        if (typeof a[dataKey] === 'string') {
          return a[dataKey].localeCompare(b[dataKey]);
        } else {
          return a[dataKey] - b[dataKey];
        }
      } else {
        if (typeof a[dataKey] === 'string') {
          return b[dataKey].localeCompare(a[dataKey]);
        } else {
          return b[dataKey] - a[dataKey];
        }
      }
    });
  }

  toggleDropdown(open: boolean, index: number) {
    this.toggleActionsRow[index] = open;
  }
}
