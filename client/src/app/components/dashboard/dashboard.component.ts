import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { faTrashCan, faEye, faHand } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faSortUp, faSortDown, faSort, faFilePdf, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { ChartConfiguration } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { buildReminderMessage, openWhatsAppReminder } from 'src/app/shared/reminder/reminder.util';

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
    private spinner: NgxSpinnerService,
    private confirmDialog: ConfirmDialogService
  ) {}

  //title = 'ng2-charts-demo';

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#5a6b64' },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#eef2f0' },
        ticks: { color: '#5a6b64' },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#0b3d2e',
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
        },
      },
    },
  };

  name: string | null = '';
  email: any = '';
  transactions: any;
  customers: any;
  toTake: any;
  toGive: any;
  summary: any = [];
  filteredSummary: any = [];
  faTrashCan = faTrashCan;
  faEye = faEye;
  faHand= faHand;
  faSearch = faSearch;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faSort = faSort;
  faFilePdf = faFilePdf;
  faEnvelope = faEnvelope;
  faWhatsapp = faWhatsapp;

  totalToTake: number = 0;
  totalToGive: number = 0;
  currency: string = 'PKR';

  searchTerm: string = '';
  sortColumn: 'toTake' | 'toGive' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  title : any;
  dataset = [
   
  ];

  async deleteCustomer(id: string) {
    const confirmed = await this.confirmDialog.confirm(
      'Delete this customer?',
      'This will permanently remove the customer and all of their transactions. This cannot be undone.',
      'Delete Customer'
    );
    if (!confirmed) return;

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
    this.authService.isAuthenticated();
    if (
      localStorage.getItem('username') != null ){
      this.name = localStorage.getItem('username');
      this.currency = localStorage.getItem('currency') || 'PKR';
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

  view(customerId: any, customerName: string) {
    this.router.navigate(['customer', customerName]);
  }

  sendEmailReminder(item: any) {
    if (!item.customerEmail) {
      this.toastr.error('This customer has no email on file');
      return;
    }

    const message = buildReminderMessage(item.customerName, this.currency, item.toTake, item.toGive);

    this.spinner.show();
    this.customerService.sendEmailReminder({
      customerEmail: item.customerEmail,
      customerName: item.customerName,
      message,
    }).subscribe(
      () => {
        this.spinner.hide();
        this.toastr.success('Reminder email sent');
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error?.error || 'Failed to send reminder email');
      }
    );
  }

  sendWhatsAppReminder(item: any) {
    if (!item.customerPhoneNo) {
      this.toastr.error('This customer has no phone number on file');
      return;
    }

    const message = buildReminderMessage(item.customerName, this.currency, item.toTake, item.toGive);
    openWhatsAppReminder(item.customerPhoneNo, message);
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
        this.applyFilterAndSort();
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  }

  applyFilterAndSort() {
    let result = [...this.summary];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      result = result.filter((item: any) =>
        item.customerName?.toLowerCase().includes(term) ||
        item.customerEmail?.toLowerCase().includes(term)
      );
    }

    if (this.sortColumn) {
      const col = this.sortColumn;
      result.sort((a: any, b: any) => {
        const diff = a[col] - b[col];
        return this.sortDirection === 'asc' ? diff : -diff;
      });
    }

    this.filteredSummary = result;
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applyFilterAndSort();
  }

  toggleSort(column: 'toTake' | 'toGive') {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  downloadPdf() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('MyLedgerPro - Customer Summary', 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [['Name', 'Email', `To Take (${this.currency})`, `To Give (${this.currency})`, 'Transactions']],
      body: this.filteredSummary.map((item: any) => [
        item.customerName,
        item.customerEmail,
        item.toTake,
        item.toGive,
        item.transactionCount,
      ]),
      headStyles: { fillColor: [15, 81, 50] },
    });

    doc.save('customer-summary.pdf');
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
      {
        data: [],
        label: 'To Take',
        backgroundColor: '#1d8a5e',
        hoverBackgroundColor: '#0f5132',
        borderRadius: 4,
        maxBarThickness: 40,
      },
      {
        data: [],
        label: 'To Give',
        backgroundColor: '#b7c1bc',
        hoverBackgroundColor: '#8a9490',
        borderRadius: 4,
        maxBarThickness: 40,
      },
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
