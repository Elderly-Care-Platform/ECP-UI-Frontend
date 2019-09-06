import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageParam, JDserviceParam } from 'src/app/core';
import { Observable } from 'rxjs';
import { ApiConstants } from 'src/app/api.constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EpcServiceService {

  serviceParam: JDserviceParam = {
    category: "Hospitals",
    catID: "10253670",
    max: 10,
    pageNo: 1
  }
  constructor(private http: HttpClient) { }

  getJDAllServices(): Observable<any> {
    let queryParams: string = "";

    Object.keys(this.serviceParam)
      .forEach((key, i) => {
        if (i > 0) {
          queryParams += `&${key}=${this.serviceParam[key]}`;
        } else {
          queryParams += `${key}=${this.serviceParam[key]}`;
        }
      });

    return this.http.get<any>(`${ApiConstants.GET_ALL_SERVICES}?${queryParams}`).pipe(
      map(response => {
        if (response) {
          return response.services;
        }
      }));
  }

  getJDServiceDetail(service: string, docId: string): Observable<any> {
    return this.http.get<any>(`${ApiConstants.GET_JD_SERVICES_DETAIL}?service${service}&docID${docId}`).pipe(
      map(response => {
        if (response) {
          return response;
        }
      }));
  }


}
