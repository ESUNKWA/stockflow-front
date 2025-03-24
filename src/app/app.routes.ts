import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'dashboard', loadComponent:()=> import('./pages/dashboard/dashboard.component')},
    {path: 'categorie', loadComponent: ()=> import('./pages/categorie/categorie.component')}
];
