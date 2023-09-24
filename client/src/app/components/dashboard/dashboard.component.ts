import { Component } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  name: string | null = '';
  email: any = '';
  transactions: any;
  customers: any;
  toTake: any;
  toGive: any;
  summary: any = [];
 
  totalToTake: number = 0;
  totalToGive: number = 0;

  ngOnInit() {
    if (
      localStorage.getItem('name') != null &&
      localStorage.getItem('email') != null
    ) {
      this.name = localStorage.getItem('name');
      this.email = localStorage.getItem('email');
      this.generateSummary(localStorage.getItem('userId'));
    }
  }
  
    testToast(){
      console.log("on click toast");
      this.toastr.success('Hello world!', 'Toastr fun!');
    }
  

  view(customerId: any) {
    console.log("customer id : " + customerId);
    console.log("user id: " + localStorage.getItem('userId'))
    this.router.navigate([
      'details/user/:userId/customer/:customerId',
      { userId: localStorage.getItem('userId'), customerId: customerId },
    ]);
  }

  getTransactions(_userEmail: any) {
    this.authService.getTransactions({ _userEmail }).subscribe(
      (res: any) => {
        // console.log('TRANSACTIONS: ', res);
        const response = JSON.parse(res);
        this.transactions = response;
      },
      (error) => {
        // console.log(JSON.stringify(error));
        alert(error.headers);
      }
    );
  }

  // getCustomers(email: any) {
  //   this.customerService.getCustomers({ email }).subscribe(
  //     (res: any) => {
  //       console.log('CUSTOMERS: ', res);
  //       const response = JSON.parse(res);
  //       this.transactions = response;
  //     },
  //     (error) => {
  //       console.log(JSON.stringify(error));
  //     }
  //   );
  // }

  generateSummary( id : any) {
    this.customerService.getCustomerSummary({ id }).subscribe(
      (res: any) => {
        console.log(res); 
        const JsonString = JSON.stringify(res);
        this.summary = JSON.parse(JsonString);

        this.summary.forEach((item: any) => {
          this.totalToTake += item.toTake;
          this.totalToGive += item.toGive;
        });

        this.customers = this.summary.map((customer: any) => ({ id: customer.customerId, name: customer.customerName }));

      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  }
}
