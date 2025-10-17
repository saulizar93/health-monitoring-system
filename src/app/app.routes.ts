import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login/login.component';
import { MetricsComponent } from './components/user-dashboard/metrics.component/metrics.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'metrics', component: MetricsComponent },
];
