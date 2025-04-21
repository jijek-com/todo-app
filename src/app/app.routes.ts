import { Routes } from '@angular/router';
import {LayoutComponent} from "./presentation/layout/layout.component";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'add', loadComponent: () => import('./presentation/add/add.component').then(m => m.AddComponent) },
      { path: 'list', loadComponent: () => import('./presentation/list/list.component').then(m => m.ListComponent) },
      { path: 'favorite', loadComponent: () => import('./presentation/list/list.component').then(m => m.ListComponent) },
      { path: '', redirectTo: 'add', pathMatch: 'full' },
      {
        path: '**',
        loadComponent: () => import('./presentation/not-found/not-found.component').then(m => m.NotFoundComponent)
      },
    ]
  }
];
