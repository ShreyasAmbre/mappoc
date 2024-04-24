import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = 'https://outpost.mapmyindia.com/api/security/oauth/token';
  private clientId: string = '33OkryzDZsK7AV3B4SCwM2O47eXeRl4evVxrPMJw7t8E0e9doJbvc_aOH2uiDpf6pYdwVBuM1Q9ySKuud1XeYw==';
  private clientSecret: string = 'lrFxI-iSEg_u5hOfFhIvtDdF2IuJfshSQ0rOnoxAithgW1QSSplMIM4A3bX49_k51_wb6p0Eyk6bkm1bUeF4x31zFbBx89ks';

  constructor(private http: HttpClient) { }

  getAuthofMMI(data: any){
    const obj = new HttpParams()
      .set('grant_type', data.grant_type)
      .set('client_id', data.client_id)
      .set('client_secret', data.client_secret)
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`${environment.outpostDomanUrl}/api/security/oauth/token`,  obj.toString(), { headers: headers })
  }

  // Proxy Server (Express.js)
  expjsGetToken(obj: any): Observable<any>{
    return this.http.post('/api/token', obj)
  }
}
