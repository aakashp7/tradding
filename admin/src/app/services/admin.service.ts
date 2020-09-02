import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient,  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor( private apiService: ApiService,
    private http: HttpClient) { }

    public adminlogin(user): Observable<any> {
      return this.apiService.request('post', 'adminlogin', user)
    }
  
    public uploadEvent($event: any) {
      console.log('from client' + JSON.stringify($event));
    }




}
