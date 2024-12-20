import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthInterceptor } from './services/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxChartsModule }from '@swimlane/ngx-charts';  // added
import { NgxSpinnerModule } from "ngx-spinner";
import { UpdateTransactionComponent } from './components/update-transaction/update-transaction.component';
import { UpdateCustomerComponent } from './components/update-customer/update-customer.component';
import { NgChartsModule } from 'ng2-charts';
import { DynamicFormGenerationComponent } from './components/dynamic-form-generation/dynamic-form-generation.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    AddCustomerComponent,
    AddTransactionComponent,
    CustomerDetailsComponent,
    NavbarComponent,
    HomeComponent,
    UpdateTransactionComponent,
    UpdateCustomerComponent,
    DynamicFormGenerationComponent
  ],
  imports: [
    NgChartsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxChartsModule,
    NgxSpinnerModule
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
