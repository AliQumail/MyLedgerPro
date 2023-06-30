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

  ngOnInit() {
    if (
      localStorage.getItem('name') != null &&
      localStorage.getItem('email') != null
    ) {
      this.name = localStorage.getItem('name');
      this.email = localStorage.getItem('email');
      // this.getTransactions(this.email);
      // this.getCustomers(this.email);
      this.generateSummary('string');
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

  getCustomers(email: any) {
    this.customerService.getCustomers({ email }).subscribe(
      (res: any) => {
        console.log('CUSTOMERS: ', res);
        const response = JSON.parse(res);
        this.transactions = response;
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  }

  generateSummary(email: any) {
    this.customerService.getCustomerSummary({ email }).subscribe(
      (res: any) => {
        const JsonString = JSON.stringify(res);
        this.summary = JSON.parse(JsonString);
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  }
}
