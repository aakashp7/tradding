import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apiService: ApiService
  ) { }


  public allUsersDetails(pageIndex, pageSize, search): Observable<any> {
    return this.apiService.request('get', 'allUsers' + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&search=' + search);
  }
  public getJoinWebinerUserList(pageIndex, pageSize, search): Observable<any> {
    return this.apiService.request('get', 'getJoinWebinerUserList' + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&search=' + search);
  }


  // update user status
  public updateUserStatus(userid, status): Observable<any> {
    return this.apiService.request('get', 'updateCustomerStatus', null, { userid: userid, status: status });
  }

  // delete user
  public DeleteUserStatus(userid, status): Observable<any> {
    return this.apiService.request('get', 'DeleteUser', null, { userid: userid, status: status });
  }


  public getSingleUserInfo(userid): Observable<any> {
    return this.apiService.request('get', 'userDetails', null, { userid: userid });
  }

  public getPaymentDetails(userid): Observable<any> {
    return this.apiService.request('get', 'paymentDetails', null, { userid: userid });
  }


  public addplans(plan): Observable<any> {
    return this.apiService.request('post', 'addMembershipPlan', plan);
  }

  public addBtcPrice(price): Observable<any> {
    return this.apiService.request('post', 'setMembershipPrice', price);
  }

  public getPrice(): Observable<any> {
    return this.apiService.request('get', 'getBTCPrice');
  }

  public getAllPlans(): Observable<any> {
    return this.apiService.request('get', 'getAllMembershipPlans');
  }

  // delete plan
  public deletePlans(id, plan): Observable<any> {
    return this.apiService.request('get', 'deletePlans', null, { id: id, plan: plan });
  }

  public setTimer(time): Observable<any> {
    return this.apiService.request('post', 'setTimer', time);
  }

  public getClockTimer(): Observable<any> {
    return this.apiService.request('get', 'getTimerForAdmin');
  }

  public adminWallet(): Observable<any> {
    return this.apiService.request('get', 'adminWallet');
  }

  public newAddress(): Observable<any> {
    return this.apiService.request('get', 'createNewAddress');
  }



  public getWalletsInfo(userId): Observable<any> {
    return this.apiService.request('get', 'userWallets/' + userId);
  }


  public getUserLoginLogsInfo(userDetails): Observable<any> {
    return this.apiService.request('get', 'userLoginLogs/' + userDetails);
  }


  verifyAddressProof(verifyAddress): Observable<any> {
    return this.apiService.request('post', 'verifyAddressProof', verifyAddress);
  }

  rejectAddressProof(rejectAddress): Observable<any> {
    return this.apiService.request('post', 'rejectAddressProof', rejectAddress);
  }


  verifyCustomerSelfie(verifySelfie): Observable<any> {
    return this.apiService.request('post', 'verifyCustomerSelfie', verifySelfie);
  }

  rejectCustomerSelfie(rejectSelfie): Observable<any> {
    return this.apiService.request('post', 'rejectCustomerSelfie', rejectSelfie);
  }

  verifyCustomerBackSide(backSide): Observable<any> {
    return this.apiService.request('post', 'verifyCustomerBackSide', backSide);
  }

  rejectCustomerBackSide(rejectBackSide): Observable<any> {
    return this.apiService.request('post', 'rejectCustomerBackSide', rejectBackSide);
  }

  verifyCustomerFrontSide(frontSide): Observable<any> {
    return this.apiService.request('post', 'verifyCustomerFrontSide', frontSide);
  }

  rejectCustomerFrontSide(rejectFrontSide): Observable<any> {
    return this.apiService.request('post', 'rejectCustomerFrontSide', rejectFrontSide);
  }


  public disableCustomer(disableUser): Observable<any> {
    return this.apiService.request('post', 'disableCustomer', disableUser);
  }


  // send receive Transaction
  public userAllTransaction(userId, pageIndex, pageSize, search): Observable<any> {
    return this.apiService.request
      ('get', 'userAllTransaction' + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&search=' + search + '&userId=' + userId);
  }


  // customer bank account
  public customerBankAccount(userId): Observable<any> {
    return this.apiService.request('get', 'userBankAccount/' + userId);
  }

  // approve or reject customer bank account
  public changeBankAccountStatus(userId, accountStatus): Observable<any> {
    return this.apiService.request('post', 'changeBankAccountStatus/' + userId, accountStatus);
  }


  // create new email template
  public createTemplate(template): Observable<any> {
    return this.apiService.request('post', 'createTemplate', template);
  }

  public setCategory(name): Observable<any> {
    return this.apiService.request('post', 'addcategory', name);
  }

  public setSubCategory(name): Observable<any> {
    return this.apiService.request('post', 'addsubcategory', name);
  }

  public deleteCategory(name): Observable<any> {
    return this.apiService.request('post', 'deletecategory', name);
  }
  public deleteCategoryById(id): Observable<any> {
    return this.apiService.request('post', 'deletecategorybyid', {id:id});
  }

  public getAllCategories(): Observable<any> {
    return this.apiService.request('get', 'getAllCategories');
  } 
  public getCategoryList(): Observable<any> {
    return this.apiService.request('get', 'getCategoryList');
  } 
  public changeCategory(item, category,planName,title): Observable<any> {
    return this.apiService.request('post', 'upload/addMediaCategory',{item,category,planName,title});
  }

   /* Service to get all comments by id */
   public getAllCommentsById(id):Observable<any> {
    return this.apiService.request('get', 'getAllCommentsByAdmin?content_id='+id);
  } 

  public deleteCommentsById(id): Observable<any> {
    return this.apiService.request('post', 'deleteCommentsById', id);
  }

  public getReportCommentsById(id):Observable<any> {
    return this.apiService.request('get', 'getReportCommentsById?content_id='+id);
  } 

  public deleteReportedComment(obj): Observable<any> {
    return this.apiService.request('post', 'deleteReportedComment', obj);
  }

  public adminReportComment(reportobj): Observable<any> {
    return this.apiService.request('post', 'adminReportComment', reportobj);
  }
}

