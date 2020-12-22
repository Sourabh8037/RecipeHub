import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated:boolean = false;
  private userSub : Subscription;

  constructor(
    private store:Store<fromApp.IAppState>,
    ){}

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(map(authData=>authData.user)).subscribe(user=>{
      this.isAuthenticated = !!user;
    });
  }

  onSaveData = () => this.store.dispatch(new RecipeActions.SaveRecipes());

  onFetchData = () => this.store.dispatch(new RecipeActions.FetchRecipes());

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  onLogout = () => this.store.dispatch(new AuthActions.Logout());

}
