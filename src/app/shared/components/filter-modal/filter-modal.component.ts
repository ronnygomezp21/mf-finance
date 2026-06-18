import {
  Component,
  EventEmitter,
  Input,
  inject,
  OnInit,
  Output,
} from '@angular/core';
// import { EntityParamsInterface } from 'src/app/modules/entity/interfaces/entity.interface';
// import { EntityService } from 'src/app/modules/entity/services/entity.service';
// import { UserTypeService } from 'src/app/modules/user-type/services/user-type.service';
import {
  ComboFilterI,
  GeneralFilterI,
} from '../../interfaces/general.interface';

@Component({
  standalone: false,
  selector: 'mf-core-filter-modal',
  templateUrl: './filter-modal.component.html',
})
export class FilterModalComponent implements OnInit {
  @Input() filterValue: boolean | null;
  @Input() entityValue: string[] | null;
  @Input() typeValue: string[] | null;
  @Input() userFilter: boolean = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() filterEvent: EventEmitter<GeneralFilterI> =
    new EventEmitter<GeneralFilterI>();
  public generalFilter: GeneralFilterI = {
    status: null,
    entityId: null,
    roleId: null,
  };
  public entityDataCombo: ComboFilterI[];
  public typeDataCombo: ComboFilterI[];
  public selectedValue: number | null = null;

  // [AI-GENERATED | skill: mf-refactor-skill | Patr?n 18 | model: gemini-2-5-pro]
  // private readonly entityService = inject(EntityService);
  // private readonly userTypeService = inject(UserTypeService);

  constructor() { }

  ngOnInit() {
    // if (this.filterValue == null) {
    //   this.filterValue = "null" as any;
    // }

    if (this.userFilter) {
      // this.entityList();
      // this.typeList();
    }

    if (!this.userFilter) {
      //this.typeList();
    }
  }

  // entityList() {
  //   const params: EntityParamsInterface = {
  //     limit: 99999,
  //     page: 1,
  //     search: null,
  //     status: true,
  //   };
  //   this.entityService.get(params).subscribe({
  //     next: (res) => {
  //       this.entityDataCombo = res.data.records.map((option) => {
  //         return {
  //           label: option.name,
  //           value: option.id,
  //         };
  //       }) as any;
  //     },
  //   });
  // }

  // typeList() {
  //   const params: EntityParamsInterface = {
  //     limit: 99999,
  //     page: 1,
  //     search: null,
  //     status: true,
  //   };
  //   this.userTypeService.get(params).subscribe({
  //     next: (res) => {
  //       this.typeDataCombo = res.data.records.map((option) => {
  //         return {
  //           label: option.name,
  //           value: option.id,
  //         };
  //       }) as any;
  //     },
  //   });
  // }

  close() {
    this.closeModal.emit(true);
  }

  emitFilterEvent() {
    if (this.filterValue === ('null' as any)) {
      this.filterValue = null;
    }

    if (this.entityValue?.length == 0) {
      this.entityValue = null;
    }

    if (this.typeValue?.length == 0) {
      this.typeValue = null;
    }

    if (this.userFilter) {
      this.generalFilter = {
        status: this.filterValue,
        entityId: this.entityValue,
        roleId: this.typeValue,
      };
      this.filterEvent.emit(this.generalFilter);
    } else {
      this.generalFilter.status = this.filterValue;
      this.generalFilter.roleId = this.typeValue;
      this.filterEvent.emit(this.generalFilter);
    }
  }

  pushChips(event: any) {
    this.selectedValue = null;
    if (!event) return;
    if (!this.entityValue?.includes(String(event.value))) {
      this.entityValue?.push(String(event.value));
    }
  }

  pushChipsType(event: any) {
    this.selectedValue = null;
    if (!event) return;
    if (!this.typeValue?.includes(String(event.value))) {
      this.typeValue?.push(String(event.value));
    }
  }

  deleteChip(chip: string) {
    this.entityValue = this.entityValue?.filter(
      (item: any) => item != chip,
    ) as any;
  }

  deleteChipType(chip: string) {
    this.typeValue = this.typeValue?.filter((item: any) => item != chip) as any;
  }

  getLabelEntity(chip: string) {
    const findLabel = this.entityDataCombo.find((f) => String(f.value) == chip);
    return findLabel?.label;
  }

  getLabelType(chip: string) {
    const findLabel = this.typeDataCombo.find((f) => String(f.value) == chip);
    return findLabel?.label;
  }

  setStatusValue(value: boolean | string) {
    if (value === ('null' as any)) {
      this.filterValue = null;
    } else {
      this.filterValue = value as any;
    }
  }
}
