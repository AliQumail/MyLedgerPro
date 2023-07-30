import { Component } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private router: Router
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
      this.generateSummary(localStorage.getItem('userid'));
    }
  }

  view(customerEmail: any) {
    console.log(customerEmail);
    this.router.navigate([
      'details/user/:useremail/customer/:customeremail',
      { useremail: 'string', customeremail: customerEmail },
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
