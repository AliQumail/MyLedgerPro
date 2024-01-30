import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { TransactionService } from 'src/app/services/transaction/transaction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
})
export class CustomerDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private transactionService: TransactionService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  customer: any;
  transactions: any = [];
  totalToGive: number = 0;
  totalToTake: number = 0;
  

  userId: any;
  customerId: any; 
  faTrashCan=faTrashCan;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
      this.customerId = params['customerId'];

      this.getCustomerDetails(this.customerId);
      this.getCustomerTransactions(this.userId, this.customerId); 
    });
  }

  getCustomerDetails(customerId: any){
    this.customerService.getCustomer(customerId).subscribe(
      (res: any) => {
        this.customer = JSON.parse(res);
        console.log(this.customer);
      },
      (error) => {
        console.log(error);
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
        console.log('TRANSACTION:  ' + this.transactions);

        this.transactions.forEach((transaction: any) => {
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
      },
      (error) => {
        console.log(error);
      }
    );

  }

  deleteTransaction(id: any) {
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
}
