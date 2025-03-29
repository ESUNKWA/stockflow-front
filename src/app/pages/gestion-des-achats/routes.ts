import { Routes } from '@angular/router';

export const achatRoutes: Routes = [
    { path: '', redirectTo: 'achat', pathMatch: 'full' },
    { path: 'achat', loadComponent: ()=> import('./achat/achat.component') },
    { path: 'historique-achat', loadComponent: ()=> import('./historique-achat/historique-achat.component') }
]

