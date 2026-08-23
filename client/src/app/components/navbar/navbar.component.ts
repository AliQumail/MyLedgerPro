import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  faSignOut,
  faEllipsisVertical,
  faUserGear,
  faUser,
  faEnvelope,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  userActive: any;
  faSignOut = faSignOut;
  faEllipsisVertical = faEllipsisVertical;
  faUserGear = faUserGear;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faMoneyBill = faMoneyBill;

  currencyOptions = ['PKR', 'USD', 'EUR', 'GBP', 'INR', 'AED', 'SAR'];

  profileForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    currency: new FormControl('PKR', Validators.required),
  });

  ngOnInit(): void {
     this.userActive = localStorage.getItem('userId');
  }

  handleLogout(){
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('currency');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  openProfile(content: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.spinner.show();
    this.authService.getProfile(userId).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.profileForm.patchValue({
          username: res.username,
          email: res.email,
          currency: res.currency || 'PKR',
        });
        this.modalService.open(content, { backdrop: 'static', backdropClass: 'customBackdrop' });
      },
      () => {
        this.spinner.hide();
        this.toastr.error('Failed to load profile');
      }
    );
  }

  saveProfile() {
    const userId = localStorage.getItem('userId');
    if (!userId || this.profileForm.invalid) return;

    this.spinner.show();
    this.authService.updateProfile(userId, this.profileForm.value).subscribe(
      (res: any) => {
        this.spinner.hide();
        localStorage.setItem('username', res.username);
        localStorage.setItem('email', res.email);
        localStorage.setItem('currency', res.currency);
        this.toastr.success('Profile updated successfully');
        this.modalService.dismissAll();
      },
      () => {
        this.spinner.hide();
        this.toastr.error('Failed to update profile');
      }
    );
  }
}
