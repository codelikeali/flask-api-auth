import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { AuthheadersService } from '../authheaders/authheaders.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { ApiEndpoints } from 'src/emums/api-endpoints';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChefService {
constructor(private http: HttpClient,
  private AuthheadersService: AuthheadersService){}
  getMenues():Observable<any>{
    return this.http.get(environment.apiUrl + 'getMenuesList',{ headers: this.AuthheadersService.createAuthHeader()});
  }
  sendFormData(data):Observable<any>{
    return this.http.post(environment.apiUrl + 'createMenue',data,{ headers: this.AuthheadersService.createAuthHeader()});
  }

}
