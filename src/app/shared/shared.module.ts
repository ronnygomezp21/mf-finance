// [AI-GENERATED | skill: unification | ticket: #unificado | model: claude-sonnet-4-6]
import { CommonModule } from '@angular/common';
import { importProvidersFrom, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
// Services
// import { ResourceService } from '../modules/resources/services/resource.service';
// import { UserTypeService } from '../modules/user-type/services/user-type.service';
// Components
import { CustomSharedSelectComponent } from './components/custom-shared-select/custom-shared-select.component';
import { DetailsModalComponent } from './components/details-modal/details-modal.component';
import { DividerComponent } from './components/divider/divider.component';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { InitialModalComponent } from './components/initial-modal/initial-modal.component';
import { NothingHerePageComponent } from './components/nothing-here-page/nothing-here-page.component';
// Components from mf-authentication
import { SharedChipsComponent } from './components/shared-chips/shared-chips.component';
import { SharedSelectComponent } from './components/shared-select/shared-select.component';
import { SharedTableComponent } from './components/shared-table/shared-table.component';
import { SharedTextareaComponent } from './components/shared-textarea/shared-textarea.component';
import { SharedStepperComponent } from './components/shared-stepper/shared-stepper.component';
// Pipes
import { CustomDateFormatPipe } from './pipes/custom-date-format.pipe';
// import { InitialModalService } from './services/inital-modal.service';
import { NeoLibComponentsModule } from '@neocore/lib-components';

@NgModule({
  declarations: [
    CustomDateFormatPipe,
    SharedTableComponent,
    FilterModalComponent,
    DetailsModalComponent,
    NothingHerePageComponent,
    SharedSelectComponent,
    SharedTextareaComponent,
    InitialModalComponent,
    DividerComponent,
    SharedChipsComponent,
    CustomSharedSelectComponent,
    SharedStepperComponent,
    // From mf-authentication
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
    NgSelectModule,
    NeoLibComponentsModule,
  ],
  exports: [
    CustomDateFormatPipe,
    SharedTableComponent,
    FilterModalComponent,
    DetailsModalComponent,
    NothingHerePageComponent,
    NgSelectModule,
    SharedSelectComponent,
    SharedTextareaComponent,
    DividerComponent,
    SharedChipsComponent,
    CustomSharedSelectComponent,
    InitialModalComponent,
    NeoLibComponentsModule,
    SharedStepperComponent,
    NgbModule,
    // From mf-authentication
  ],
  providers: [
    importProvidersFrom([NgSelectModule]),
    //CenteredModalComponent,
    // UserTypeService,
    // ResourceService,
    //InitialModalService,
  ],
})
export class SharedModule { }
