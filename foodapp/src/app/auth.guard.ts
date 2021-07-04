import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { CookieService } from "ngx-cookie-service";

import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
   mappingUrl: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,private CookieService:CookieService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      const token = this.CookieService.get('token');
      const user_token = this.CookieService.get('user_token');
      // const currentUserGuest = this.guestService.currentUserValue;
      if (token!="" && token !=undefined) {
        if(user_token=='user'){
          return true;
        }
        // this.mappingUrl = localStorage.getItem("url");
        // localStorage.setItem("clickMapping", this.mappingUrl);

      }

    // not logged in so redirect to login page with the return url
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    this.mappingUrl = localStorage.getItem("url");
    localStorage.clear();
    localStorage.setItem("clickMapping", this.mappingUrl);
    return false;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(["/login"]);
    localStorage.clear();
    return false;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authenticationService.currentUserValue;

    if (currentUser) {
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(["/login"], {
      queryParams: { returnUrl: route.path },
    });
    localStorage.clear();
    return false;
  }

}
