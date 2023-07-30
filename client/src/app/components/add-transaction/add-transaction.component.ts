import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from 'src/app/services/transaction/transaction.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
})
export class AddTransactionComponent {
  closeResult: string = '';
  modalOptions: NgbModalOptions;
  @Input() customers: any; 
  // customers: any = [
  //   {
  //     name: 'cust 1',
  //     id: 0,
  //   },
  //   {
  //     name: 'cust 2',
  //     id: 2
  //   },
  // ];

  constructor(
    private modalService: NgbModal,
    private transactionService: TransactionService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
  }

  addTransactionForm: FormGroup = new FormGroup({
    customerId: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),    
  });

  addTransaction(transaction: any) {
    transaction.userId = localStorage.getItem('userid');
    this.transactionService
      .addTransaction(transaction)
      .subscribe(
        (res: any) => {
          console.log(res);
        },
        (error) => {
          console.log(JSON.stringify(error));
          alert(error.headers);
        }
      );
  }

  open(content: any) {
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
