import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  facebookIcon = faFacebook;
  linkedinIcon = faLinkedin;
  twitterIcon = faTwitter;

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required, 
      Validators.minLength(6)
    ]),
    email: new FormControl('', [
      Validators.required, 
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(8)
    ])
  });

  register(user: any) {
    this.spinner.show();
    this.authService.register(user).subscribe(
      (response) => {
        this.spinner.hide();
        this.toastr.success("Registration successful")
        this.router.navigate(['/login']);
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error("Please enter a valid user")
      }
    );
  }
}
