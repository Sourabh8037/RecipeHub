import { Action } from '@ngrx/store';
import { Recipe } from '../recipe-model';

export const SET_RECIPES = '[Recipe] SET_RECIPES';
export const ADD_RECIPE = '[Recipe] ADD_RECIPE';
export const UPDATE_RECIPE = '[Recipe] UPDATE_RECIPE';
export const DELETE_RECIPE = '[Recipe] DELETE_RECIPE';
export const FETCH_RECIPES = '[Recipe] FETCH_RECIPES'; 
export const SAVE_RECIPES = '[Recipe] SAVE_RECIPES';

export class SetRecipes implements Action{
  readonly type = SET_RECIPES;
  constructor(public payload:Recipe[]){};
}
export class AddRecipe implements Action{
  readonly type = ADD_RECIPE;
  constructor (public payload:Recipe){};
}
export class FetchRecipes implements Action{
  readonly type = FETCH_RECIPES;
}
export class SaveRecipes implements Action{
  readonly type = SAVE_RECIPES;
}
export class DeleteRecipe implements Action{
  readonly type = DELETE_RECIPE;
  constructor(public payload:number){}
}
export class UpdateRecipe implements Action{
  readonly type = UPDATE_RECIPE;
  constructor(public payload:{index:number,recipe:Recipe}){};
}

export type RecipeActions = SetRecipes | AddRecipe | DeleteRecipe | UpdateRecipe;