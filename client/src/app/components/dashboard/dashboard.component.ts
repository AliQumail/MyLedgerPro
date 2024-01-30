import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
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
    private toastr: ToastrService,
    private location: Location,
    private spinner: NgxSpinnerService
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

  title = 'barchartApp';
  dataset = [
    { name: 'X', value: 1 },
    { name: 'Y', value: 2 },
  ];

  deleteCustomer(id: string) {
    this.spinner.show();
    this.customerService.deleteCustomer(id).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.toastr.success('Customer deleted successfully');
        this.generateSummary(localStorage.getItem('userId'));
      } else {
        this.spinner.hide();
        this.toastr.error('Error while deleting customer');
      }
    });
  }

  // for graph
  ngOnInit() {
    if (
      localStorage.getItem('name') != null &&
      localStorage.getItem('email') != null
    ) {
      this.name = localStorage.getItem('name');
      this.email = localStorage.getItem('email');
      console.log('userId');
      console.log(localStorage.getItem('userId'));
      this.generateSummary(localStorage.getItem('userId'));
    }
  }

  testToast() {
    console.log('on click toast');
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

  handleRefreshList() {
    this.generateSummary(localStorage.getItem('userId'));
  }

  showGraphicalView: number = 0;

  HandleGraphicalView() {
    this.showGraphicalView = this.showGraphicalView == 1 ? 0 : 1;
  }

  view(customerId: any) {
    this.router.navigate([
      'details/user/:userId/customer/:customerId',
      { userId: localStorage.getItem('userId'), customerId: customerId },
    ]);
  }

  getTransactions(_userEmail: any) {
    this.authService.getTransactions({ _userEmail }).subscribe(
      (res: any) => {
        const response = JSON.parse(res);
        this.transactions = response;
      },
      (error) => {
        alert(error.headers);
      }
    );
  }

  generateSummary(id: any) {
    this.totalToGive = 0;
    this.totalToTake = 0;
    this.customerService.getCustomerSummary({ id }).subscribe(
      (res: any) => {
        console.log(res);
        const JsonString = JSON.stringify(res);
        this.summary = JSON.parse(JsonString);
        this.summary.forEach((item: any) => {
          this.totalToTake += item.toTake;
          this.totalToGive += item.toGive;
        });
        this.customers = this.summary.map((customer: any) => ({
          id: customer.customerId,
          name: customer.customerName,
        }));
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  }
}
