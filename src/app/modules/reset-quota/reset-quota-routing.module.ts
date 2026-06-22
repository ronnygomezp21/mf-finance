import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';

const routes: Routes = [{
  path: 'list',
  component: ListComponent
},
{
  path: '**',
  redirectTo: 'list',
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetQuotaRoutingModule { }
