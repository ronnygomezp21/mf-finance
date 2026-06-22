import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

// Pages
import { ListComponent } from './pages/list/list.component';
import { RecordComponent } from './pages/record/record.component';
import { EditComponent } from './pages/edit/edit.component';

// Components
import { SupplierTabsComponent } from './components/supplier-tabs/supplier-tabs.component';
import { ReasonModalComponent } from './components/reason-modal/reason-modal.component';

// Forms
import { GeneralFormComponent } from './forms/general-form/general-form.component';
import { FiscalFormComponent } from './forms/fiscal-form/fiscal-form.component';
import { BankingFormComponent } from './forms/banking-form/banking-form.component';
import { ContactsFormComponent } from './forms/contacts-form/contacts-form.component';
import { QuotaFormComponent } from './forms/quota-form/quota-form.component';
import { RetentionsFormComponent } from './forms/retentions-form/retentions-form.component';


@NgModule({
  declarations: [
    // Pages
    ListComponent,
    RecordComponent,
    EditComponent,
    // Components
    SupplierTabsComponent,
    ReasonModalComponent,
    // Forms
    GeneralFormComponent,
    FiscalFormComponent,
    BankingFormComponent,
    ContactsFormComponent,
    QuotaFormComponent,
    RetentionsFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SupplierRoutingModule,
    SharedModule,
  ]
})
export class SupplierModule { }

