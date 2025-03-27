import { Routes } from '@angular/router';

export const produitRoutes: Routes = [
    {path: '', redirectTo: 'categorie', pathMatch: 'full'},
    {path: 'categorie', loadComponent: ()=> import('./categorie/categorie.component')},
    {path: 'produit', loadComponent: ()=> import('./produit/produit.component')},
    {path: 'fournisseurs', loadComponent: ()=> import('./fournisseurs/fournisseurs.component')}
]