import { Routes } from '@angular/router';
import DefaultComponent from './default/default.component';

export const routes: Routes = [
    {path: 'login', loadComponent:()=> import('./pages/login/login.component')},
    {path: '', component: DefaultComponent, children: [
        {path: 'dashboard', loadComponent:()=> import('./pages/dashboard/dashboard.component')},
        {path: 'categorie', loadComponent: ()=> import('./pages/categorie/categorie.component')},
        {path: 'produit', loadComponent: ()=> import('./pages/produit/produit.component')}
    ]}
];
