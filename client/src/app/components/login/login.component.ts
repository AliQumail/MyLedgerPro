import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService) {}

  facebookIcon = faFacebook;
  linkedinIcon = faLinkedin;
  twitterIcon = faTwitter;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  // Login
  login(user: any) {
    this.authService.login(user).subscribe(
      (res: any) => {
        console.log('res: ', res);
        if (res == "User doesn't exist" || res == "Password doesn't match") {
          alert(res);
        } else {
          const response = JSON.parse(res);
          console.log(response.token);
          console.log(response.name);
          localStorage.setItem('token', response.token);
          localStorage.setItem('name', response.name);
          localStorage.setItem('email', response.email);
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        console.log(JSON.stringify(error));
        alert(error.headers);
      }
    );
  }
}
