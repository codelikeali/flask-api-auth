import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { ReplaySubject , Observable } from 'rxjs';
import { AuthheadersService } from '../authheaders/authheaders.service';
import { ApiEndpoints } from 'src/emums/api-endpoints';

import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient,
    private getHeader: AuthheadersService) { }

    orderBook(data):Observable<any>{
    return this.http.post(environment.apiUrl + ApiEndpoints.login,data,{ headers: this.getHeader.createHeader()});
  }
}
