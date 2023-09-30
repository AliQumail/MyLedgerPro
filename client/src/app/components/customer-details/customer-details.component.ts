import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { TransactionService } from 'src/app/services/transaction/transaction.service';

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
    private toastr: ToastrService
  ) {}

  customer: any;
  transactions: any = [];
  totalToGive: number = 0;
  totalToTake: number = 0;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const userId = params['userId'];
      const customerId = params['customerId'];

      this.customerService.getCustomer(customerId).subscribe(
        (res: any) => {
          this.customer = JSON.parse(res);
          console.log(this.customer);
        },
        (error) => {
          console.log(error);
        }
      );

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
    });
  }

  deleteTransaction(id: any) {
    this.transactionService.deleteTransaction(id).subscribe((res: any) => {
      if (res) {
        this.toastr.success("Transaction deleted successfully")
        console.log("Delete successful");
      } else {
        console.log("Delete unsuccessful");
      }
    });
  }


}
