import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { ApiEndpoints } from 'src/emums/api-endpoints';
import { environment } from '../../environments/environment';
import { AuthheadersService } from '../authheaders/authheaders.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient,
    private getHeader: AuthheadersService) { }

  login(data):Observable<any>{
    return this.http.post(environment.apiUrl + ApiEndpoints.login,data,{ headers: this.getHeader.createHeader()});
  }

  register(data):Observable<any>{
    return this.http.post(environment.apiUrl + ApiEndpoints.register,data,{ headers: this.getHeader.createAuthMultipartHeader()});
  }
}
