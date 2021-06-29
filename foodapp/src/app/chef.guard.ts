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
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";
@Injectable({
  providedIn: 'root'
})
export class ChefGuard implements CanActivate {
  mappingUrl: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUser = this.authenticationService.currentUserValue;
    // const currentUserGuest = this.guestService.currentUserValue;
    if (currentUser) {
      this.mappingUrl = localStorage.getItem("url");
      localStorage.setItem("clickMapping", this.mappingUrl);
      return false;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(["/auth"], { queryParams: { returnUrl: state.url } });
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
    const currentUser = this.authenticationService.currentChef;
    if (currentUser) {
      // logged in so return true
      return false;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(["/auth"]);
    localStorage.clear();
    return false;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authenticationService.currentUserValue;

    if (currentUser) {
      return false;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(["/auth"], {
      queryParams: { returnUrl: route.path },
    });
    localStorage.clear();
    return false;
  }
}
