import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';
import {Router} from '@angular/router';
import { User } from './User.model';
import { PassingData } from '../shared/passingData.service';
import { CoreComponent } from '../core/core.component';

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: number,
    localId: string,
    registered?: boolean
  
  }
  
  @Injectable({providedIn: 'root'})
  export class AuthService {
    private tokenExpirationTimer:any;
   
    user = new BehaviorSubject<User|null>(null);
  
    constructor(private http: HttpClient, private  router: Router,private passDataService: PassingData) {
    }
  
    signUp(email: string, pass: string) {
      return this.http
        .post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAlFOPBcWw4oArx_k4RPnqOVELphTnVJbU',
          {
            email: email,
            password: pass,
            returnSecureToken: true
          })
        .pipe(
          catchError(this.handleError),
          tap(
            (resData) => {
              this.handleAuthentication(
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn
              );
            }
          ));
    };
  
    signIn(email: string, pass: string) {
      return this.http
        .post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAlFOPBcWw4oArx_k4RPnqOVELphTnVJbU',
          {
            email: email,
            password: pass,
            returnSecureToken: true
          })
        .pipe(
          catchError(this.handleError),
          tap(
            (resData) => {
              this.handleAuthentication(
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn
              );
            }
          ));
    };
  
    autoLogin() {
      const userLoadedData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData')|| '{}');
  
      if (!userLoadedData) {
        return;
      }
      const loadedUser = new User(
        userLoadedData.email,
        userLoadedData.id,
        userLoadedData._token,
        new Date(userLoadedData._tokenExpirationDate)
      );
      if (loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration =
          new Date(userLoadedData._tokenExpirationDate).getTime()
          - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    }
  
   logout() {
      this.user.next(null);
      this.router.navigate(['/auth']);
      localStorage.removeItem('userData');
      localStorage.removeItem('questionsForm');
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
  
    }
  
    autoLogout(expirationDuration: number) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
      }, expirationDuration);
    }
  
    private handleAuthentication(email: string, id: string, token: string, expiresIn: number) {
      const expirationData = new Date(new Date().getTime() + +expiresIn * 1000);
      const user = new User(
        email,
        id,
        token,
        expirationData
      );
      this.user.next(user);
      // this.autoLogout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
  
  
    }
  
    private handleError(errorResponse: HttpErrorResponse) {
      let errorMessage = 'Unknown error occurred';
      //if unknown error occurred
      if (!errorResponse.error || !errorResponse.error.error) {
        return throwError(errorMessage);
      }
      switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exist';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'The email or the password is wrong';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'The email or the password is wrong';
          break;
      }
      return throwError(errorMessage);
    }
  }
  