// [AI-GENERATED | skill: mf-feature-skill | ticket: #011 | model: antigravity]

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetQuotaRoutingModule } from './reset-quota-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

// Pages
import { ListComponent } from './pages/list/list.component';

@NgModule({
  declarations: [
    ListComponent,
  ],
  imports: [
    CommonModule,
    ResetQuotaRoutingModule,
    SharedModule,
  ]
})
export class ResetQuotaModule { }
