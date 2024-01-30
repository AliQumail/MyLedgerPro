import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from 'src/app/services/transaction/transaction.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-update-transaction',
  templateUrl: './update-transaction.component.html',
  styleUrls: ['./update-transaction.component.css']
})
export class UpdateTransactionComponent implements OnInit {
  closeResult: string = '';
  modalOptions: NgbModalOptions;
  @Input() transaction: any; 
  customers : any = [];
  @Output() refreshList : EventEmitter<any> = new EventEmitter(); 
  faEdit= faEdit;
 
  constructor(
    private modalService: NgbModal,
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };   
  }

  ngOnInit() {
    this.customers = {}
    this.populateForm();
  }

  populateForm(){
    this.updateTransactionForm.patchValue({
      status: this.transaction.status,
      amount: this.transaction.amount
    })
  }

  updateTransactionForm: FormGroup = new FormGroup({
    // customerId: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),    
  });

  updateTransaction(transaction: any) {
    this.spinner.show();
    this.transactionService
      .updateTransaction(this.transaction.id, transaction)
      .subscribe(
        (res: any) => {
          this.spinner.hide()
          console.log(res);
          this.toastr.success();
          this.refreshList.emit();
          this.updateTransactionForm.reset();
          this.modalService.dismissAll(); 
        },
        (error) => {
          this.spinner.hide()
          console.log(JSON.stringify(error));
          this.toastr.error("Transaction failed");
          // alert(error.headers);
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
