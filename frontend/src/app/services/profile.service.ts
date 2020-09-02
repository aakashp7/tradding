import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  public getUserProfile(): Observable<any> {
    return this.apiService.request('get', 'getprofile')
  }
  public updateProfile(user): Observable<any>{
    return this.apiService.request('post','updateprofile',user);
}
}
