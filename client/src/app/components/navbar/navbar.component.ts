import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  faSignOut } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  constructor(private router: Router) {
    
  };
  userActive: any;
  faSignOut = faSignOut;

  ngOnInit(): void {
     this.userActive = localStorage.getItem('userId');
  }
  handleLogout(){
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}
