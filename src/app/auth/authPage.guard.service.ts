import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthPageGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):Observable <boolean>|Promise<boolean>|boolean|UrlTree {
    return this.authService.user.pipe(
        map((user) => {
           const isAuth = !!user;                   
           if (isAuth) {
            this.router.navigate(['/']);
             return false;
             
           } else {
             
             return true;
           }
         })
       );
     }
   }
