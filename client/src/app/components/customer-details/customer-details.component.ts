import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { TransactionService } from 'src/app/services/transaction/transaction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faFilePdf, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
  providers: [DatePipe]
})
export class CustomerDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private transactionService: TransactionService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private confirmDialog: ConfirmDialogService

  ) {}

  customer: any = {};
  transactions: any = [];
  filteredTransactions: any = [];
  totalToGive: number = 0;
  totalToTake: number = 0;
  currency: string = 'PKR';

  userId: any;
  customerId: any;
  customerName: any;
  faTrashCan=faTrashCan;
  faArrowLeft = faArrowLeft;
  faFilePdf = faFilePdf;
  faEnvelope = faEnvelope;
  faWhatsapp = faWhatsapp;

  startDate: string = '';
  endDate: string = '';

  ngOnInit() {
    this.authService.isAuthenticated();
    this.currency = localStorage.getItem('currency') || 'PKR';
    this.userId = localStorage.getItem('userId');

    this.route.params.subscribe((params) => {
      this.customerName = params['customerName'];

      if (!this.userId || !this.customerName) {
        this.router.navigate(['/dashboard']);
        return;
      }

      this.resolveCustomer();
    });
  }

  resolveCustomer() {
    this.spinner.show();
    this.customerService.getCustomerByName(this.userId, this.customerName).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (!res) {
          this.toastr.error('Customer not found');
          this.router.navigate(['/dashboard']);
          return;
        }
        this.customer = { name: res.name, id: res.id, email: res.email, phoneNo: res.phoneNo };
        this.customerId = res.id;
        this.getCustomerTransactions(this.userId, this.customerId);
      },
      () => {
        this.spinner.hide();
        this.toastr.error('Customer not found');
        this.router.navigate(['/dashboard']);
      }
    );
  }

  handleRefreshList(){
    this.getCustomerTransactions(this.userId, this.customerId);
  }

  getCustomerTransactions(userId: any, customerId: any){
    this.totalToGive = 0;
    this.totalToTake = 0;
    this.transactionService.getTransaction(userId, customerId).subscribe(
      (res: any) => {
        this.transactions = JSON.parse(res);
        this.transactions.forEach((transaction: any) => {
          transaction.rawDate = transaction.date;
          transaction.date = this.formatDate(transaction.date);
          if (transaction.status == 'Give') {
            this.totalToTake += transaction.amount;
          } else {
            this.totalToGive += transaction.amount;
          }
        });

        if (this.totalToTake > this.totalToGive) {
          this.totalToTake -= this.totalToGive;
          this.totalToGive = 0;
        } else {
          this.totalToGive -= this.totalToTake;
          this.totalToTake = 0;
        }

        this.applyDateFilter();
      },
      (error) => {
      }
    );

  }

  applyDateFilter() {
    let result = [...this.transactions];

    if (this.startDate) {
      const start = new Date(this.startDate);
      result = result.filter((t: any) => new Date(t.rawDate) >= start);
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((t: any) => new Date(t.rawDate) <= end);
    }

    this.filteredTransactions = result;
  }

  onDateFilterChange() {
    this.applyDateFilter();
  }

  clearDateFilter() {
    this.startDate = '';
    this.endDate = '';
    this.applyDateFilter();
  }

  downloadPdf() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const green: [number, number, number] = [15, 81, 50];
    const grey: [number, number, number] = [90, 107, 100];

    // Header band
    doc.setFillColor(...green);
    doc.rect(0, 0, pageWidth, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('MyLedgerPro', margin, 13);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Transaction History  •  ${this.customer.name}`, margin, 21);

    // Summary cards
    const cardY = 36;
    const cardHeight = 22;
    const cardGap = 6;
    const cardWidth = (pageWidth - margin * 2 - cardGap) / 2;

    const drawCard = (x: number, label: string, value: string, accent: [number, number, number]) => {
      doc.setDrawColor(...accent);
      doc.setLineWidth(0.8);
      doc.line(x, cardY, x, cardY + cardHeight);
      doc.setFillColor(247, 250, 248);
      doc.rect(x, cardY, cardWidth, cardHeight, 'F');
      doc.setDrawColor(231, 236, 233);
      doc.setLineWidth(0.3);
      doc.rect(x, cardY, cardWidth, cardHeight, 'S');
      doc.line(x, cardY, x, cardY + cardHeight);

      doc.setTextColor(...grey);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(label.toUpperCase(), x + 6, cardY + 8);

      doc.setTextColor(11, 61, 46);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(value, x + 6, cardY + 17);
    };

    drawCard(margin, `To Give (${this.currency})`, this.totalToGive.toLocaleString(), grey);
    drawCard(margin + cardWidth + cardGap, `To Take (${this.currency})`, this.totalToTake.toLocaleString(), green);

    autoTable(doc, {
      startY: cardY + cardHeight + 10,
      head: [['Status', `Amount (${this.currency})`, 'Date']],
      body: this.filteredTransactions.map((t: any) => [t.status, t.amount, t.date]),
      headStyles: { fillColor: green },
    });

    doc.save(`${this.customer.name}-transactions.pdf`);
  }

  buildReminderMessage(): string {
    if (this.totalToTake > 0) {
      return `Hi ${this.customer.name}, this is a friendly reminder that you have an outstanding balance of ${this.currency} ${this.totalToTake.toLocaleString()} with us. Please arrange payment at your earliest convenience. Thank you! - MyLedgerPro`;
    }
    if (this.totalToGive > 0) {
      return `Hi ${this.customer.name}, just a note that we owe you ${this.currency} ${this.totalToGive.toLocaleString()}. We'll settle this soon. Thank you! - MyLedgerPro`;
    }
    return `Hi ${this.customer.name}, your account is fully settled. Thank you for being a valued customer! - MyLedgerPro`;
  }

  sendEmailReminder() {
    if (!this.customer.email) {
      this.toastr.error('This customer has no email on file');
      return;
    }

    this.spinner.show();
    this.customerService.sendEmailReminder({
      customerEmail: this.customer.email,
      customerName: this.customer.name,
      message: this.buildReminderMessage(),
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

  sendWhatsAppReminder() {
    if (!this.customer.phoneNo) {
      this.toastr.error('This customer has no phone number on file');
      return;
    }

    const digits = this.customer.phoneNo.replace(/\D/g, '');
    const text = encodeURIComponent(this.buildReminderMessage());
    window.open(`https://wa.me/${digits}?text=${text}`, '_blank');
  }

  async deleteTransaction(id: any) {
    const confirmed = await this.confirmDialog.confirm(
      'Delete this transaction?',
      'This will permanently remove the transaction and cannot be undone.',
      'Delete Transaction'
    );
    if (!confirmed) return;

    this.spinner.show();
    this.transactionService.deleteTransaction(id).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.toastr.success("Transaction deleted successfully")
        this.getCustomerTransactions(this.userId, this.customerId);
        console.log("Delete successful");
      } else {
        this.spinner.hide();
        console.log("Delete unsuccessful");
      }
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMM dd, yyyy, h:mm a') || '';
  }
}
