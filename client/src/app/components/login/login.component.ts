import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router) {}

  facebookIcon = faFacebook;
  linkedinIcon = faLinkedin;
  twitterIcon = faTwitter;
  


  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });


  // Login
  login() {
    // this.authService.login(user).subscribe(
    //   (res: any) => {
    //     console.log('res: ', res);
    //     if (res == "User doesn't exist" || res == "Password doesn't match") {
    //       alert(res);
    //     } else {
    //       const response = JSON.parse(res);
    //       localStorage.setItem('token', response.token);
    //       console.log("role ", response.role);
    //       localStorage.setItem("role", response.role);
    //       localStorage.setItem('refreshtoken', response.refreshToken);
    //       this.router.navigate(['/user']);
    //     }
    //   },
    //   (error) => {
    //     console.log(JSON.stringify(error));
    //     alert(error.headers);
    //   }
    // );
  }

}
