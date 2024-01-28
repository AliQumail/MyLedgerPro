import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css']
})
export class UpdateCustomerComponent implements OnInit {
  title = 'ng-bootstrap-modal-demo';
  closeResult: string = '';
  modalOptions: NgbModalOptions;
  @Output() refreshList: EventEmitter<string> = new EventEmitter();
  @Input() customer: any; 

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

  ngOnInit(): void {
    console.log(this.customer);
    this.updateCustomerForm.patchValue({
      name: this.customer.customerName,
      phoneno: this.customer.customerPhoneNo,
      email :  this.customer.customerEmail
    })
  }

  updateCustomerForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    phoneno: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    
  });
 

  updateCustomer(customerDetails: any) {
    this.spinner.show();
    customerDetails.userId = localStorage.getItem("userId"); 
    customerDetails.customerEmail = this.customer.customerEmail;
    this.customerService.updateCustomer(this.customer.customerId, customerDetails).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log(res);
        this.toastr.success("Customer update successfully");
        this.refreshList.emit();
        this.updateCustomerForm.reset();
        this.modalService.dismissAll(); 
      },
      (error) => {
        this.spinner.hide(); 
        console.log(JSON.stringify(error));
        this.toastr.error("Failed to add customer");
        //alert(error.headers);
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
