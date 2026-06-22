import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierAuditRoutingModule } from './supplier-audit-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListComponent } from './pages/list/list.component';


@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    SupplierAuditRoutingModule,
    SharedModule,
  ]
})
export class SupplierAuditModule { }
