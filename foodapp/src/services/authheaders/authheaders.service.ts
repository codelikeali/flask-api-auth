import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AuthheadersService {
  constructor(private cookieService: CookieService) { }
  headers(multipart = false) {
    if (!this.cookieService.check('token') ) {
      if ( multipart ) {
        return this.createAuthMultipartHeader();
      }else {
        return this.createAuthHeader();
      }
    } else {
      return this.createHeader();
    }
  }
  createHeader() {
    return new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
  }
  createAuthHeader() {
    return new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Accept', 'application/json')
      .append('x-access-tokens',this.cookieService.get('token'));
  }
  createPostHeader(/*token = null*/) {
    if ( true ) {
      return new HttpHeaders()
        .append('Content-Type', 'application/x-www-form-urlencoded')
        .append('Accept', 'application/json');

    }
  }
  createAuthMultipartHeader() {

    if ( true ) {
      return new HttpHeaders()
        // .append('Content-Type', 'multipart/form-data')
        .append('Accept', 'application/json')
        .append('Authorization',this.cookieService.get('token'));
    }
  }
}
