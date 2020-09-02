import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,BehaviorSubject} from 'rxjs';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  onSelectCategory = new BehaviorSubject<string>("");
  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  selectCategory(name: string): void {
		this.onSelectCategory.next(name);
	}

  // user registeration service method
  public registration(userDetails): Observable<any> {
    return this.apiService.request('post', 'userRegistration', userDetails);
  }

  public login(user): Observable<any> {
    return this.apiService.request('post', 'login', user)
  }

  public getEmailVerified(id): Observable<any> {
    return this.apiService.externalrequest('get', 'accountverify', null, { str: id })
  }

  public getPaymentVerified(id): Observable<any> {
    return this.apiService.externalrequest('get', 'paymentverify', null, { str: id })
  }

  public getCountries(): Observable<any> {
    return this.apiService.request('get', 'countrylist');
  }

  public getPlans(): Observable<any> {
    return this.apiService.request('get', 'getmembershipPlans');
  }

  public expiryCheck(): Observable<any> {
    return this.apiService.request('get', 'expiryCheck');
  }

  public forgotPassword(email): Observable<any> {
    return this.apiService.request('post', 'forgetPassword', email);
  }

  public otpVerify(code): Observable<any> {
    return this.apiService.request('post', 'codeVerification', code);
  }

  public resetPassword(password): Observable<any> {
    return this.apiService.request('post', 'resetPassword', password);
  }

  public getClockTimer(): Observable<any> {
    return this.apiService.request('get', 'getTimer');
  }

  public getOrders(pageIndex, pageSize, search): Observable<any> {
    return this.apiService.request('get', 'trade/getOrders' + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&search=' + search);
  }

  public getPositions(): Observable<any> {
    return this.apiService.request('get', 'trade/getPositions');
  }

  public getMargin(): Observable<any> {
    return this.apiService.request('get', 'trade/getMargin');
  }

  public getFillOrders(): Observable<any> {
    return this.apiService.request('get', 'trade/getFilledOrders');
  }

  public getActiveOrders(): Observable<any> {
    return this.apiService.request('get', 'trade/getActiveOrders');
  }

  public getInstrument(): Observable<any> {
    return this.apiService.request('get', 'trade/getInstrument');
  }


  public adminUploads(): Observable<any> {
    return this.apiService.request('get', 'getContent');
  }
  public getContentById(id): Observable<any> {
    return this.apiService.request('post', 'getContentById',{id:id});
  }

  public adminPublicUploads(): Observable<any> {
    return this.apiService.request('get', 'getPublicContent');
  }

  public changePassword(password): Observable<any> {
    return this.apiService.request('post', 'changePassword', password);
  }

  public getloginlogs(pageIndex, pageSize): Observable<any> {
    return this.apiService.request('get', 'getloginlogs' + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize);
  }


  public getpaymentHistory(): Observable<any> {
    return this.apiService.request('get', 'getpaymentHistory');
  }

  public planrenewalReq(plan): Observable<any> {
    return this.apiService.request('post', 'planRenewal', plan);
  }

  public getUserCurrentSubscription(): Observable<any> {
    return this.apiService.request('get', 'getUserCurrentSubs');
  }

  public addBitmexAccess(keys): Observable<any> {
    return this.apiService.request('post', 'addBitmexAccess', keys);
  }

  public removeBitmexAccess(): Observable<any> {
    return this.apiService.request('get', 'removeBitmexAccess');
  }


  public getUserOrders(pageIndex, pageSize, search): Observable<any> {
    return this.apiService.request('get', 'trade/getUserOrders' + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&search=' + search);
  }

  public getUserPositions(): Observable<any> {
    return this.apiService.request('get', 'trade/getUserPositions');
  }

  public getUserFilledOrders(): Observable<any> {
    return this.apiService.request('get', 'trade/getUserFilledOrders');
  }

  public getUserActiveOrders(): Observable<any> {
    return this.apiService.request('get', 'trade/getUserActiveOrders');
  }

  public getUserInstrument(): Observable<any> {
    return this.apiService.request('get', 'trade/getUserInstrument');
  }

  public getUserData(): Observable<any> {
    return this.apiService.request('get', 'trade/getUserData');
  }

  public getAdminBitmexAccount(): Observable<any> {
    return this.apiService.request('get', 'trade/getAdminBitmexAccount');
  }
  public getAllCategories(): Observable<any> {
    return this.apiService.request('get', 'getCategoriesByUsers');
  }  
  public contactUs(form): Observable<any> {
    return this.apiService.request('post', 'contactus',form);
  }
  public sendMail(form): Observable<any> {
    return this.apiService.request('post', 'sendmail',form);
  }

  public addCommentsOnContents(commentobj): Observable<any> {
    return this.apiService.request('post', 'addComment', commentobj);
  }

  public getAllCommentsById(id, limit):Observable<any> {
    return this.apiService.request('get', 'getAllComments?content_id='+id+'&limit='+limit);
  } 

  public reportComment(reportobj): Observable<any> {
    return this.apiService.request('post', 'reportComment', reportobj);
  }

  public sendUserJoinMail(form): Observable<any>{
    return this.apiService.request('post', 'sendUserJoinMail', form);
  }
}
