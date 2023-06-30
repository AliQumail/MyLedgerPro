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
            this.transactions =JSON.parse(res);
            console.log('TRANSACTION:  ' + this.transactions);
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
