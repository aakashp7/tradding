import { Component } from '@angular/core';
import { ApiService } from "./services/api.service";
import { Router } from '@angular/router';
import { MatTabChangeEvent, MatTableDataSource, MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, PageEvent, MatSlideToggle, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(public apiService: ApiService,
    private router: Router, private snack: MatSnackBar) { }

  logout() {
    this.apiService.logout();
    this.snack.open(
      'You are logged out successfully!', 'X', { duration: 4000, panelClass: ['info-snackbar'], horizontalPosition: 'end' });
    this.router.navigate(['']);
  }
  onActivate(event) {
    window.scroll(0,0);
    
}
}
