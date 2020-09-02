import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from "../../services/api.service";
import { AdminService } from "../../services/admin.service";

import { MatSnackBar, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  rememberEmail: any;
  rememberPassword: any;
  remember = false;
  errorMessage = '';
  hide = true;
  isAuthy = false;
  _csrf: '';

  constructor(
    private snack: MatSnackBar,
    private router: Router,
    private apiService: ApiService,
    private adminService: AdminService,
  ) {
  }

  // login form
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    _csrf: new FormControl('', [Validators.required])

  });

  ngOnInit() {
    this.csrf();
    if (this.apiService.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
  }

  csrf() {
    this.apiService.gtcsrf().subscribe((success) => {
      this._csrf = success._csrf;
      this.loginForm.patchValue({ _csrf: this._csrf });
     }, error => {
       this.snack.open(error.message, 'X', { duration: 4000 , panelClass: ['error-snackbar'], horizontalPosition: 'end' });
     });   }

 // convenience getter for easy access to form fields
 get fc() { return this.loginForm.controls; }

 adminLogin() {
  // stop here if form is invalid
  if (this.loginForm.invalid) {
    return false;
  }
  this.adminService.adminlogin(this.loginForm.value).subscribe((result) => {
    if (result.status === true) {
      this.snack.open(result.message, 'X', { duration: 4000, panelClass: ['info-snackbar'], horizontalPosition: 'end' });
      this.router.navigateByUrl('/dashboard');
    }
    if (result.status === false) {
      this.snack.open(result.message, 'X', { duration: 4000, panelClass: ['error-snackbar'], horizontalPosition: 'end' });
    }
    if (result[0]) {
      this.snack.open(result[0], 'X', { duration: 4000, panelClass: ['error-snackbar'], horizontalPosition: 'end' });
    }
  }, error => {
    this.snack.open(error.message, 'X', { duration: 4000, panelClass: ['error-snackbar'], horizontalPosition: 'end' });
  });
}


}
