import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipe-model';
import * as RecipeActions from './recipe.actions';

@Injectable()
export class RecipeEffects{
  constructor(
    private actions$:Actions,
    private http:HttpClient,
    private store:Store<fromApp.IAppState>
  ){};
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(()=>{
      const userData:{email:string,id:string,_token:string,_tokenExpirationDate:string} = JSON.parse(localStorage.getItem('user'));
      return this.http.get<Recipe[]>(`https://angularproject-1fd9d.firebaseio.com/${userData.id}/recipes.json`)
    }),
    map(recipes=>{
      return recipes.map(recipe=>{
        return {...recipe,ingredients: recipe.ingredients ? recipe.ingredients : []}
      })
    }),
    map(recipes=>{
      return new RecipeActions.SetRecipes(recipes);
    })
    )

    @Effect({dispatch:false})
    saveRecipes = this.actions$.pipe(
      ofType(RecipeActions.SAVE_RECIPES),
      withLatestFrom(this.store.select('recipe')),
      switchMap(([actionData,recipeState])=>{
        const userData:{email:string,id:string,_token:string,_tokenExpirationDate:string} = JSON.parse(localStorage.getItem('user'));
        return this.http.put(`https://angularproject-1fd9d.firebaseio.com/${userData.id}/recipes.json`,recipeState.recipes);
      })
      )

}