import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { faTrashCan, faEye, faHand } from '@fortawesome/free-regular-svg-icons';
import { ChartConfiguration } from 'chart.js';

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

  //title = 'ng2-charts-demo';

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  name: string | null = '';
  email: any = '';
  transactions: any;
  customers: any;
  toTake: any;
  toGive: any;
  summary: any = [];
  faTrashCan = faTrashCan;
  faEye = faEye; 
  faHand= faHand; 

  totalToTake: number = 0;
  totalToGive: number = 0;

  title : any = 'barchartApp';
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
      localStorage.getItem('username') != null ){
      this.name = localStorage.getItem('username');
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
        this.updateGraphicalView();
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  }

  onSwitchChange(event: any){
    const isChecked = event.target.checked;
    
    if (isChecked) {
      this.showGraphicalView = 1; 
    } else {
      this.showGraphicalView = 0;
    }
  }

  updateGraphicalView(){
    
    let labels : any = [];
    let datasets : any = [
      { data: [], label: 'To Take' },
      { data: [], label: 'To Give' },
    ];

    for (var customer of this.summary) {
      labels.push(customer.customerName);
      datasets[0].data.push(customer.toTake);
      datasets[1].data.push(customer.toGive)
    }
    const newData = {
      labels: labels,
      datasets: datasets
    };
    this.barChartData = newData;
  }
}
