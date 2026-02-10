import { Routes } from '@angular/router';

export const routes: Routes = [

    {
      path: '',
      redirectTo: 'table', pathMatch: 'full'
    },

    {
        path:'table',
        loadComponent:() => import("./components/table/table").then(m=>m.Table)
    }

];
