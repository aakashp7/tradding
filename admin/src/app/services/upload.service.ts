import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';
import { HttpClient, HttpParams, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    public apiService: ApiService,
    private http: HttpClient,
    private snack: MatSnackBar) { }

  // service to get validations on media content fixed by admin
  public getValidations(): Observable<any> {
    return this.apiService.request('get', 'media/mediavalidations');
  }

  uploadFileData(url: string, file: File): Observable<HttpEvent<any>> {
    let formData = new FormData();
    formData.append('file', file);
    var newToken = localStorage.getItem('sdasd923hd9dwe');
    const options = {
      reportProgress: true,
      withCredentials: true,
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` })
    };
    const req = new HttpRequest('POST', url, formData, options);
    return this.http.request(req);
  }

  getToken() {
    var newToken = localStorage.getItem('sdasd923hd9dwe');
    if (newToken && newToken != null) {
      return newToken;
    } else {
      return newToken = '';
    }
  }

  // user-post service
  public adminUpload(vidobj,files): Observable<any> {
    console.log(vidobj,"vidobj");
    console.log(files,"files");
    // const formData = new FormData();
    // if (files.length > 0) {
    //   files.forEach(function (item, index) {
    //     formData.append(index, item, item.name);
    //   })
    // }
    // if (Object.keys(vidobj).length > 0) {
    //   for (var key in vidobj) {
    //     if (vidobj[key] !== null || typeof vidobj[key] !== undefined || vidobj[key] !== "") {
    //       formData.append(key, vidobj[key]);
    //     }
    //   }
    // }
    return this.apiService.request('post', "upload/adminUploads" + "?_csrf=" + files._csrf, vidobj)
  }

  public adminUploadsImage(files, vidobj): Observable<any> {
    const formData = new FormData();
    if (files.length > 0) {
      files.forEach(function (item, index) {
        formData.append(index, item, item.name);
      })
    }
    if (Object.keys(vidobj).length > 0) {
      for (var key in vidobj) {
        if (vidobj[key] !== null || typeof vidobj[key] !== undefined || vidobj[key] !== "") {

          if (key === 'category') {
            formData.append(key, JSON.stringify(vidobj[key]) );
          }
          else{
            formData.append(key, vidobj[key]);
          }

          // formData.append(key, vidobj[key]);
        }
      }
    }
    return this.apiService.request('post', "upload/adminUploadsImage" + "?_csrf=" + vidobj._csrf, formData)
  }

  public adminAudioUpload(files, audobj): Observable<any> {
    console.log("files, audobj =======>>>>>", files, audobj);

    const formData = new FormData();
    if (files.length > 0) {
      files.forEach(function (item, index) {
        formData.append(index, item, item.name);
      })
    }
    if (Object.keys(audobj).length > 0) {
      for (var key in audobj) {
        if (audobj[key] !== null || typeof audobj[key] !== undefined || audobj[key] !== "") {
          formData.append(key, audobj[key]);
        }
      }
    }
    return this.apiService.request('post', "upload/adminaudioUpload" + "?_csrf=" + audobj._csrf, formData)
  }

  public uploadArticle(files, article): Observable<any> {
    console.log("files, article =======>>>>>", files, article);
    
    const formData = new FormData();
    if (files.length > 0) {
      files.forEach(function (item, index) {
        formData.append(index, item, item.name);
      })
    }
    if (Object.keys(article).length > 0) {
      for (var key in article) {
        if (article[key] !== null || typeof article[key] !== undefined || article[key] !== "") {
          formData.append(key, article[key]);
        }
      }
    }
    console.log("article._csrf", article._csrf);
    
    return this.apiService.request('post', "upload/uploadArticles" + "?_csrf="+ article._csrf, formData);
  }

  public adminUploads(): Observable<any> {
    return this.apiService.request('get', 'getAdminContent');
  }

  public uploadArticleImage(): Observable<any> {
    return this.apiService.request('post', 'upload/articleImage');
  }

  // delete uploads ..
  public DeleteUpload(id, type): Observable<any> {
    return this.apiService.request('get', 'deleteUploads', null, { id: id, type: type });
  }

  // edit Admin Uploads..
  public editAdminUpload(id,videoTitle,videoURL,postObj): Observable<any> {    
    const formData = new FormData();
    formData.append("id", id);
    formData.append("videoTitle", videoTitle);
    formData.append("videoURL", videoURL);
   const data ={"id":id,"videoTitle":videoTitle,"videoURL":videoURL};
   console.log(formData);
    // const formData = new FormData();
    // if (files.length > 0) {
    //   files.forEach(function (item, index) {
    //     formData.append(index, item, item.name);
    //   })
    // }
    // if (Object.keys(postObj).length > 0) {
    //   for (var key in postObj) {
    //     if (postObj[key] !== null || typeof postObj[key] !== undefined || postObj[key] !== "") {
    //       formData.append(key, postObj[key]);
    //     }
    //   }
    // }
    // else {
    //   this.snack.open('Please Fill required field', 'X', { duration: 4000, panelClass: ['error-snackbar'], horizontalPosition: 'end' });
    // }
    // if (Object.keys(postObj).length > 0 && Object.keys(postObj).length > 0) {
    //   return this.apiService.request('post', "upload/edituploads" + "?_csrf=" + postObj._csrf, formData)
    // }
    return this.apiService.request('post', "upload/edituploads" + "?_csrf=" + postObj._csrf, data)
  }

  // edit Audio Admin Uploads..
  public editAudioAdminUpload(postObj, files): Observable<any> {    
    const formData = new FormData();
    if (files.length > 0) {
      files.forEach(function (item, index) {
        formData.append(index, item, item.name);
      })
    }
    if (Object.keys(postObj).length > 0) {
      for (var key in postObj) {
        if (postObj[key] !== null || typeof postObj[key] !== undefined || postObj[key] !== "") {
          formData.append(key, postObj[key]);
        }
      }
    }
    else {
      this.snack.open('Please Fill required field', 'X', { duration: 4000, panelClass: ['error-snackbar'], horizontalPosition: 'end' });
    }
    if (Object.keys(postObj).length > 0 && Object.keys(postObj).length > 0) {
      return this.apiService.request('post', "upload/editAudioUpload" + "?_csrf=" + postObj._csrf, formData)
    }
  }

  public updateArticle(article): Observable<any> {
    return this.apiService.request('post', 'upload/updateArticle', article);
  }

}
