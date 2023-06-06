import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private router: Router, private authService: AuthService) {}

  facebookIcon = faFacebook;
  linkedinIcon = faLinkedin;
  twitterIcon = faTwitter;

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    phoneno: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  register(user: any) {
    this.authService.register(user).subscribe(
      (response) => {
        console.log('Registration successful: ', response);
        alert('Registration successful');
        this.router.navigate(['/']);
      },
      (error) => {
        console.log('Registration failed: ', error);
        alert('Registration failed');
      }
    );
  }
}
