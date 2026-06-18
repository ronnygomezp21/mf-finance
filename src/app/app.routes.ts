import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'supplier',
        loadChildren: () =>
            import('./modules/supplier/supplier.module').then(
                (m) => m.SupplierModule,
            ),
    },
];
