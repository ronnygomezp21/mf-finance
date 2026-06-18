import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableColumnDataI } from '@neocore/lib-components';
import { DetailsDataI } from '../../interfaces/general.interface';

@Component({
  standalone: false,
  selector: 'mf-core-details-modal',
  templateUrl: './details-modal.component.html',
})
export class DetailsModalComponent implements OnInit {
  @Input() dataModal: any[] = [];
  @Input() tableColumns: TableColumnDataI[] = [];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  public dataModalDetails: DetailsDataI[] = [];

  constructor() { }

  ngOnInit() {
    this.newArrayData();
  }

  newArrayData() {
    this.tableColumns.forEach((item: any) => {
      const value = this.dataModal[item.dataKey];
      this.dataModalDetails.push({
        label: item.name,
        value: value,
      });
    });
  }

  close() {
    this.closeModal.emit(true);
  }
}
