import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  // { path: 'login', redirectTo: 'index', pathMatch: 'full' },
  // { path: 'register', redirectTo: 'index', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./index/index.module').then(m => m.IndexModule) },
  { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
