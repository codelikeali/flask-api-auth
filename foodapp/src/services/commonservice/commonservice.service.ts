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
export class CommonserviceService {

  constructor(private http: HttpClient,private AuthheadersService:AuthheadersService,private socket: Socket) { }

  getMyOrders(){
    let response =  this.http.get(environment.apiUrl+'getwaitingRooms',{ headers: this.AuthheadersService.createHeader()}).toPromise();
    return response;
  }

  myOrdersSockets() {
    return this.socket.fromEvent('myOrders').pipe(map((data: any) => data))
  }
  getDoctorListSocket(){
    return this.socket.fromEvent('getDoctorListSocket').pipe(map((data: any) => data))
  }
}
