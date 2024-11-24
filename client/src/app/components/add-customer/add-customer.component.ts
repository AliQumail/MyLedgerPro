import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
})
export class AddCustomerComponent {
  title = 'ng-bootstrap-modal-demo';
  closeResult: string = '';
  modalOptions: NgbModalOptions;
  @Output() refreshList: EventEmitter<string> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
  }

  addCustomerForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    phoneno: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{11}$/)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });
 

  addCustomer(customerDetails: any) {
    this.spinner.show();
    customerDetails.userId = localStorage.getItem("userId"); 
    this.customerService.addCustomer(customerDetails).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.toastr.success("Customer added successfully");
        this.refreshList.emit();
        this.addCustomerForm.reset();
        this.modalService.dismissAll(); 
      },
      (error) => {
        this.spinner.hide(); 
        this.toastr.error("Customer already exists");
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
