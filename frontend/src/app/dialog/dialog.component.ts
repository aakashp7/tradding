import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { ApiService } from "../services/api.service";
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  _csrf: '';
  timesUp: any;
  noPlans: any;
  articleRead: any;
  articlesafe: any;
  articletitle: any;
  imgShow: any;
  imgPop: any;
  paymentStatus: any;
  userData: any;

  renewPlanFrom = new FormGroup({
    plan: new FormControl('', Validators.required),
    _csrf: new FormControl('', [Validators.required])
  }); 

  membershipPlans: any;
  expiryStatus:any;
  remainingDays: any;
  expiryDate: any;
  renewReq = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public apiService: ApiService,
    private userService: UserService, 
    private router: Router, 
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<DialogComponent>,
    protected sanitized: DomSanitizer
  ) {
    if (data) {
      if (data.timesUp) {
        this.timesUp = data.timesUp;
      }
      if (data.noPlans) {
        this.noPlans = data.noPlans;
      }
      if (data.articleRead) {
        this.articleRead = data.articleRead;
        this.articlesafe = data.articleData;
        this.articletitle = data.articletitle;
      }
      if (data.imgShow) {
        this.imgShow = data.imgShow;
        this.imgPop = data.imgPop
      }
      if (data.paymentStatus) {        
        this.paymentStatus = data.paymentStatus;
        this.userData = data.paymentData;
        this.membershipPlans = data.plans;
      }
      if (data.expiryStatus) {        
        this.expiryStatus = data.expiryStatus;
        this.remainingDays = data.remainingDays;
        this.expiryDate = data.expiryDate;
      }
    }
  }

  ngOnInit() {
    this.csrf();
  }

  csrf() {
    this.apiService.gtcsrf().subscribe((success) => {
      this._csrf = success._csrf;
      this.renewPlanFrom.patchValue({ _csrf: this._csrf });
    }, error => {
      this.snack.open(error.message, 'X', { duration: 4000, panelClass: ['error-snackbar'], horizontalPosition: 'end' });
    });
  }

  // convenience getter for easy access to form fields
  get fc() { return this.renewPlanFrom.controls; }

  safeHtml(html) {
    return this.sanitized.bypassSecurityTrustHtml(html);
  }

  // safeHtmlImg(img){
  //   return this.sanitized.bypassSecurityTrustUrl(img);
  // }

  close(): void {
    this.dialogRef.close();
  }
  

  logout() {
    this.apiService.logout();
    this.snack.open(
      'You are logged out successfully!', 'X', { duration: 4000, panelClass: ['info-snackbar'], horizontalPosition: 'end' });
    this.router.navigate(['']);
    this.dialogRef.close();
  }

  renewPlan(){    
    this.userService.planrenewalReq(this.renewPlanFrom.value).subscribe((success) => {
      if (success.status === true) {
        this.renewReq = false;
        this.snack.open(success.message, 'X', { duration: 4000, panelClass: ['info-snackbar'], horizontalPosition: 'end' });
      }
      if (success.status === false) {
        this.snack.open(success.message, 'X', { duration: 4000, panelClass: ['error-snackbar'], horizontalPosition: 'end' });
      }
    }, error => {
      this.snack.open(error.message, 'X', { duration: 4000, panelClass: ['error-snackbar'], horizontalPosition: 'end' });
    });
  }

  renewPage(){
    this.router.navigate(['/paymenthistory']);
    this.dialogRef.close();
  }
}
