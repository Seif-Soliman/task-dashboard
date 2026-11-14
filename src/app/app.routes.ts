import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.Dashboard),
      },
      {
        path: 'analytics',
        title: 'Analytics',
        loadComponent: () =>
          import('./features/analytics/analytics.component').then((m) => m.AnalyticsComponent),
      },
      {
        path: 'team',
        title: 'Team',
        loadComponent: () => import('./features/team/team.component').then((m) => m.TeamComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
