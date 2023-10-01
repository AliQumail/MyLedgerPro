import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
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
    private toastr: ToastrService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
  }

  addCustomerForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    phoneno: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    
  });
 

  addCustomer(customerDetails: any) {
    customerDetails.userId = localStorage.getItem("userId"); 
    console.log("before add customer api ")
    console.log(customerDetails);
    this.customerService.addCustomer(customerDetails).subscribe(
      (res: any) => {
        console.log(res);
        this.toastr.success("Customer added successfully");
        this.refreshList.emit();
        this.addCustomerForm.reset();
        this.modalService.dismissAll(); 
      },
      (error) => {
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
