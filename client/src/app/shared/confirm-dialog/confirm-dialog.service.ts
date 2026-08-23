import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  constructor(private modalService: NgbModal) {}

  confirm(
    title: string = 'Are you sure?',
    message: string = 'This action cannot be undone.',
    confirmLabel: string = 'Delete'
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true,
    });

    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.confirmLabel = confirmLabel;

    return modalRef.result.then(
      () => true,
      () => false
    );
  }
}
