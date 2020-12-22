import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';
import * as fromRecipe from '../recipes/store/recipe.reducer';

export interface IAppState{
  shoppingList:fromShoppingList.IShoppingListState;
  auth:fromAuth.IAuthState;
  recipe:fromRecipe.IRecipeState;
}

export const appReducer:ActionReducerMap<IAppState> = {
  shoppingList:fromShoppingList.shoppingListReducer,
  auth:fromAuth.authReducer,
  recipe:fromRecipe.recipeReducer
}