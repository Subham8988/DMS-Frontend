import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [{
  path:'',
  redirectTo:'/Admin/Login',
  pathMatch: 'full'

},
{
  path:'Admin/Login',
  component:LoginComponent
  // components:LoginComponent,

},
{
  path:'Admin/Dashboard',
  component:LandingPageComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
