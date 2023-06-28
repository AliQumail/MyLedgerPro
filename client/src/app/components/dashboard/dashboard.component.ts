import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(private authService: AuthService, private customerService: CustomerService) {}

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
      this.getTransactions(this.email);
      this.getCustomers(this.email);
      this.generateSummary();
    }
  }

  getTransactions(email: any) {
    this.authService.getTransactions({ email }).subscribe(
      (res: any) => {
        console.log('TRANSACTIONS: ', res);
        const response = JSON.parse(res);
        this.transactions = response;
      },
      (error) => {
        console.log(JSON.stringify(error));
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
        alert(error.headers);
      }
    );
  }

  generateSummary() {
    console.log("CALLED GENERATESUMMARY")
    let custName,
      custEmail,
      totalGiven = 0,
      totalTaken = 0,
      given,
      taken;
    for (let i = 0; i < this.customers.length; i++) {
      custName = this.customers[i].name;
      custEmail = this.customers[i].email;
      for (let j = 0; j < this.transactions.length; j++) {
        if (custEmail == this.transactions[j].email) {
          if (this.transactions[j].status == 'Given') {
            totalGiven += this.transactions[j].amount;
          } else {
            totalTaken += this.transactions[j].amount;
          }
        }
      }
      if (totalGiven > totalTaken) {
        given = totalGiven - totalTaken;
        taken = 0;
      } else {
        taken = totalTaken - totalGiven;
        given = 0;
      }

      this.summary.push({
        name: custName,
        email: custEmail,
        given: given,
        taken: taken,
      });
      given = 0;
      taken = 0;
      totalGiven = 0;
      totalTaken = 0;
    }
    console.log("TOTAL SUMMARY: " + JSON.stringify(this.summary));
  }
}
