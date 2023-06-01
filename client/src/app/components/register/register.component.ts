import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {

  facebookIcon = faFacebook;
  linkedinIcon = faLinkedin;
  twitterIcon = faTwitter;
  
  
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });


  register(){
    
  }
}
