import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { AuthService } from './auth.service';

@Injectable({providedIn:'root'})
export class AuthGaurd implements CanActivate{
  constructor(public authService:AuthService,public router:Router,private store:Store<fromApp.IAppState>){}
  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){  
    return this.store.select('auth').pipe(take(1),map(authState=>{
      const isAuth = !!authState.user;
      if(isAuth)
      return true;
      // USING URL TREE FOR AUTHENTICATION
      return this.router.createUrlTree(['/auth']);
    }));
  }
}