import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchplacesComponent } from './components/searchplaces/searchplaces.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'home/searchplaces', component: SearchplacesComponent },
  
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }