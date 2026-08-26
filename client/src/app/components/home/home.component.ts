import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { faFlask } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  faFlask = faFlask;

  tryTestUser() {
    this.spinner.show();
    this.authService.demoLogin().subscribe(
      (response: any) => {
        this.spinner.hide();
        localStorage.setItem('userId', response.id);
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('email', response.email);
        localStorage.setItem('currency', response.currency || 'PKR');
        this.toastr.success('Logged in as test user');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.spinner.hide();
        this.toastr.error('Demo account is not available right now');
      }
    );
  }
}
