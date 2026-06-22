import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'supplier',
        loadChildren: () =>
            import('./modules/supplier/supplier.module').then(
                (m) => m.SupplierModule,
            ),
    },
    {
        path: 'supplier-audit',
        loadChildren: () =>
            import('./modules/supplier-audit/supplier-audit.module').then(
                (m) => m.SupplierAuditModule,
            ),
    },
    {
        path: 'supplier-reset-quota',
        loadChildren: () =>
            import('./modules/reset-quota/reset-quota.module').then(
                (m) => m.ResetQuotaModule,
            ),
    },
];
