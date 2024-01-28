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
    username: new FormControl('', Validators.required),
    // phoneno: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
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
        this.toastr.error("Error while registering user")
      }
    );
  }
}
