import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import {environment} from '../../../environments/environment';
import * as AuthActions from './auth.actions';

export interface IAuthResponseData{
  kind?:string;
  idToken:string;
  email:string;
  refreshToken:string;
  expiresIn:string;
  localId:string;
  registered?:boolean
}

@Injectable()
export class AuthEffects{

  constructor(
    private actions$:Actions,
    private http:HttpClient,
    private router:Router,
    private authService:AuthService
    ){};

    @Effect()
    authSignup = this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((authData:AuthActions.SignupStart) =>
        this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIkey}`,{
        email:authData.payload.email,
        password:authData.payload.password,
        returnSecureToken:true
      }).pipe(tap(resData=>this.authService.setLogoutTimer(+resData.expiresIn*1000)), map(resData=>this.handleAuthentication(resData)),
      catchError(errorResponse=>this.handleError(errorResponse))
      )
    )
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData:AuthActions.LoginStart) =>
      this.http.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIkey}`,{
      email:authData.payload.email,
      password:authData.payload.password,
      returnSecureToken:true
    }).pipe(tap(resData=>this.authService.setLogoutTimer(+resData.expiresIn*1000)), map(resData => this.handleAuthentication(resData)),
    catchError(errorResponse=>this.handleError(errorResponse))))
    );

    @Effect()
    autoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN), 
    map(()=>{
    const userData:{email:string,id:string,_token:string,_tokenExpirationDate:string} = JSON.parse(localStorage.getItem('user'));
    
    if(!userData)
    return {type:'DUMMY'};
    
    const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));
    
    if(loadedUser.token){
    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    // this.autoLogout(expirationDuration);
    this.authService.setLogoutTimer(expirationDuration);
    return new AuthActions.AuthenticateSuccess({loadedUser,redirect:false});
      }
    return {type:'DUMMY'};
    }
  ));

    // LOGIN OUT
    @Effect({dispatch:false})
    authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT),
    tap(()=>{
      localStorage.removeItem('user');
      this.authService.clearLogoutTimer();
      this.router.navigate(['auth']);
    }))

    // REDIRECTION IF LOGIN/SIGNUP SUCCESS
    @Effect({dispatch:false})
    authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS),tap((authSuccessAction:AuthActions.AuthenticateSuccess)=>{
      if(authSuccessAction.payload.redirect)
      this.router.navigate(['/']);
    }))

    // HANDLE AUTHENTICATION
    handleAuthentication =  (resData) =>{
      const expirationDate = new Date(new Date().getTime() + +resData.expiresIn*1000);
      const user = new User(
        resData.email,
        resData.localId,
        resData.idToken,
        expirationDate
        );
      localStorage.setItem('user',JSON.stringify(user));
      return new AuthActions.AuthenticateSuccess({loadedUser:user,redirect:true});
    }

    // HANDLE ERROR
    handleError = (errorResponse) =>{
      let title = 'Unknown Error!';
      let body = 'An unknown error occured!';        
      if(!errorResponse.error || !errorResponse.error.error){
        return of(new AuthActions.AuthenticateFail({title,body}));
      }
      switch(errorResponse.error.error.message){
        case 'EMAIL_EXISTS':
          title = 'EMAIL_EXISTS';
          body = 'This email already exists!';
          break;
        case 'EMAIL_NOT_FOUND':
          title = 'EMAIL_NOT_FOUND';
        body = 'There is no user record corresponding to this email. The user may have been deleted.';
        break;
        case 'INVALID_PASSWORD':
          title = 'INVALID_PASSWORD';
        body = 'The password is invalid.';
        break;
        case 'USER_DISABLED':
          title = 'USER_DISABLED';
        body = 'The user account has been disabled by an administrator.'
        break;
      }
      return of(new AuthActions.AuthenticateFail({title,body}));
    }
}