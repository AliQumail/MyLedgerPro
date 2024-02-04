import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {}

  facebookIcon = faFacebook;
  linkedinIcon = faLinkedin;
  twitterIcon = faTwitter;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  // Login
  login(user: any) {
    this.spinner.show();
    this.authService.login(user).subscribe(
      (res: any) => {
        this.spinner.hide(); 
        console.log('res: ', res);
        if (res == "User doesn't exist" || res == "Password doesn't match") {
          alert(res);
        } else {
          
          const response = JSON.parse(res);
          localStorage.setItem('userId', response.id);
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          // localStorage.setItem('email', response.email);
          this.toastr.success("Login successful");
          setTimeout(()=>{
            this.router.navigate(['/dashboard']);
          }, 1500)
        }
      },
      (error) => {
        this.spinner.hide(); 
        console.log(JSON.stringify(error));
        this.toastr.error("Invalid credentials");      }
    );
  }
}
