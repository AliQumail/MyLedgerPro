import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private transactionService: TransactionService
  ) {}

  customer: any;
  transactions: any = [];
  totalToGive: number = 0;
  totalToTake: number = 0;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const useremail = params['useremail'];
      const customeremail = params['customeremail'];

      this.customerService.getCustomer({ email: customeremail }).subscribe(
        (res: any) => {
          this.customer = JSON.parse(res);
          console.log(this.customer);
        },
        (error) => {
          console.log(error);
        }
      );

      this.transactionService
        .getTransaction({ userEmail: useremail, customerEmail: customeremail })
        .subscribe(
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

      // You can now use the extracted emails as needed
      console.log('User Email:', useremail);
      console.log('Customer Email:', customeremail);
    });
  }
}
