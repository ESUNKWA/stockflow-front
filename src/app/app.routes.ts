import { Routes } from '@angular/router';
import DefaultComponent from './default/default.component';
import { GestionDesProduitsComponent } from './pages/gestion-des-produits/gestion-des-produits.component';
import { produitRoutes } from './pages/gestion-des-produits/routes';


export const routes: Routes = [
    {path: 'login', loadComponent:()=> import('./pages/login/login.component'), title: 'StockFlow | Connexion'},
    {path: '', component: DefaultComponent, children: [
        {path: 'dashboard', loadComponent:()=> import('./pages/dashboard/dashboard.component'), title: 'StockFlow | Tableau de bord'},
        {path: 'gestion-des-produits', component: GestionDesProduitsComponent, children: produitRoutes, title: 'StockFlow | Gestion des produits'},
    ]}
];
