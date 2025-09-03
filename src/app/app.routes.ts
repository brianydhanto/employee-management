import { Routes } from '@angular/router';
import { EmployeeGuard } from '../core/guards/employee.guard';
import { AuthGuard } from '../core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((component) => component.LoginComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'employee',
    loadComponent: () => import('./employee/employee').then((component) => component.EmployeeComponent),
    canActivate: [EmployeeGuard],
    children: [
      {
        path: 'list',
        loadComponent: () => import('./employee/employee-list/employee-list').then((component) => component.EmployeeListComponent),
      },
      {
        path: 'add',
        loadComponent: () => import('./employee/employee-add/employee-add').then((component) => component.EmployeeAddComponent),
      },
      {
        path: 'detail',
        loadComponent: () => import('./employee/employee-detail/employee-detail').then((component) => component.EmployeeDetailComponent),
      },
      { 
        path: '', 
        redirectTo: 'list', 
        pathMatch: 'full' 
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('../shared/components/not-found/not-found').then((component) => component.notFoundComponent),
  },
];
