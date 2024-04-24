import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let sessionData:any = sessionStorage.getItem('MMIData')
    if(sessionData && request.url != 'https://outpost.mappls.com/api/security/oauth/token'){
      const token = JSON.parse(sessionData).token;
      const tokenType = JSON.parse(sessionData).token_type
      
      
  
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `${tokenType} ${token}`
        }
      });
  
      return next.handle(modifiedRequest);
    }else{
      return next.handle(request);
    }
    
  }
}
