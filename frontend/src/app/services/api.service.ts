import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators/map";


/*
    interface for token
 */
interface TokenResponse {
  token: string;
}


/*
  specific format of create user call reponse
*/
export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  userid: number;
  usercurrency:string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api_url: string = environment.apiEndPoint;
  

  private token: string;
  public env: string;


  constructor(private http: HttpClient, private router: Router) {
    this.env = this.getEnv();
}


/* 
        save token into localStorage as a item with specific key
     */
    private saveToken(token: string): void {
      localStorage.setItem('sdasd923hd9dwe', token);
      this.token = token;
  }

  /*
      save env in localstorage
   */
  public saveEnv(val:string): void{
      localStorage.removeItem('env');
      localStorage.setItem('env',val);
      this.env = val;
  }
  /*
      call for fetch env from localStrogae
   */
  public getEnv(): string {

      if (!this.env) {
          this.env = localStorage.getItem('env');
      }
      return this.env;
  }

  /*
      call for fetch token from localStrogae
   */
  private getToken(): string {

      if (!this.token) {
          this.token = localStorage.getItem('sdasd923hd9dwe');
      }
      return this.token;
  }

  /*
      fetch user token details
   */
  public getUserDetails(): UserDetails {
      const token = this.getToken();
      let payload;
      if (token) {
          payload = token.split('.')[1];
          payload = window.atob(payload);
          return JSON.parse(payload);
      } else {
          return null;
      }
  }

  /*
      call for check the user session
   */
  public isLoggedIn(): boolean {
      const user = this.getUserDetails();
     // console.log(user);
      if (user) {
         // console.log(user.exp > Date.now() / 1000);
          return user.exp > Date.now() / 1000;
      } else {
          return false;
      }
  }

  /*
      all type of api call handlers at client side and send token in header in all GET api call to verify valid user
      application at back end match user token with this token, if both token are match means this is a valid user otherwise
      return with a exception invalid user
   */
  public request(method: 'post' | 'get', type, user?, paramslist?): Observable<any> {
      let base;

      if (method === 'post') {
          if (type === 'registration' || type === 'login' || type === 'securityauth') {
              base = this.http.post<any>(this.api_url + type, user, {
                  withCredentials: true
              });
          } else {
              base = this.http.post<any>(this.api_url + type, user, {
                  withCredentials: true,
                  headers: {Authorization: `Bearer ${this.getToken()}`}
              });
          }
      } else { 
          base = this.http.get<any>(this.api_url + type, {
              headers: {
                  Authorization: `Bearer ${this.getToken()}`,
                  "Access-Control-Allow-Origin":"*", 
                  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                  'mode':'cors'
                },
              withCredentials: true,
              params: paramslist
          });          
      }
      if(type==='login'){
          this.saveEnv('real');
      }
      const request = base.pipe(
          map((data: TokenResponse) => {
              if (data !== null && data.token) {
                  this.saveToken(data.token);
              }
              return data;
          })
      );

      return request;
  }
//headers: {'env':this.cookieService.get('env')}
  public externalrequest(method: 'post' | 'get', type, user?, paramslist?): Observable<any> {
      if (method === 'get') {
          return this.http.get<any>(this.api_url + type, {withCredentials: true, params: paramslist});
      } else {
          return this.http.post<any>(this.api_url + type, user, {withCredentials: true, params: paramslist});
      }
  }
  //,'env':this.cookieService.get('env')
 

  public gtcsrf(): Observable<any> {
      return this.http.get<any>(this.api_url + 'csrf', {withCredentials: true});
  }
 
  public logout(): void {
      this.env='';
      this.token = '';
      window.localStorage.removeItem('env');
      window.localStorage.removeItem('sdasd923hd9dwe');
      this.router.navigateByUrl('/index');
  }

  public indexLogout(): void {
      this.env='';
      this.token = '';
      window.localStorage.removeItem('env');
      window.localStorage.removeItem('sdasd923hd9dwe');
      this.router.navigateByUrl('/index');
  }

  public getAuthenticationOptions(): Observable<any> {
      return this.request('get', 'authoptions')
  }

  public verifyAuthentication(authObj): Observable<any> {
      return this.request('post', 'verifyauthentication', authObj)
  }



}
