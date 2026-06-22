import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { RecordComponent } from './pages/record/record.component';
import { EditComponent } from './pages/edit/edit.component';

const routes: Routes = [
  {
    path: "list",
    component: ListComponent
  },
  {
    path: "record",
    component: RecordComponent
  },
  {
    path: "edit",
    component: EditComponent
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }

