import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    { path: '', component: HomeComponent },  
    { path: 'dashboard', component: DashboardComponent },
    { path: 'details/user/:useremail/customer/:customeremail', component: CustomerDetailsComponent}
   
  ];
  

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  