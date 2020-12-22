import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { Recipe } from './recipe-model';
import * as RecipeActions from './store/recipe.actions';

@Injectable({providedIn:'root'})

export class RecipeResolverService implements Resolve<Recipe[]>{
  constructor(
    private store:Store<fromApp.IAppState>,
    private actions$:Actions
    ){}
  resolve(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
    return this.store.select('recipe').pipe(
    take(1),
    map(recipeState=>{
      return recipeState.recipes;
    }),
    switchMap(recipes=>{
      if(!recipes){
      this.store.dispatch(new RecipeActions.FetchRecipes());
      return this.actions$.pipe(take(1),ofType(RecipeActions.SET_RECIPES));
      }else
      return of(recipes);
    })
    )
  }
}