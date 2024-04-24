import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class HomemeService {
  citiesCollection = [
    {
      type: "Feature",
      properties: {
        htmlPopup: "ABC"
        },
      geometry: {
        type: "Point",
        coordinates: [19.4596019,72.7994593],
      },
    },
    {
      type: "Feature",
      properties: {
        htmlPopup: "DEF"
      },
      geometry: {
        type: "Point",
        coordinates: [19.4585083, 72.80273135],
      },
    },
    {
      type: "Feature",
      properties: {
        htmlPopup: "GHI"
      },
      geometry: {
        type: "Point",
        coordinates: [19.44463155, 72.80463765],
      },
    },
  ]


  constructor(private http: HttpClient ) {}

  getSearchData(obj: any): Observable<any>{
    let searchString = `query=${obj.query}&region=${environment.country}&location=&filter=`
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.get(`${environment.atlasDomainUrl}/api/places/textsearch/json?${searchString}`, { headers } )
  }

  // Proxy Server (Express.js)
  expjsGetSearchPlaces(obj: any): Observable<any>{
    return this.http.post('/api/places', obj)
  }

  


}
