import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/Ingredient.model';
import { Recipe } from './recipe-model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService{
  
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe("Cheese Pizza1","Tasty, Delicious Pizza!!!","https://chatpatidiary.files.wordpress.com/2015/01/dsc_1769.jpg",[
  //     new Ingredient("Meat1",500,Units.mg),
  //     new Ingredient("French Fries1",20,Units.unit),
  //   ]),
  //   new Recipe("Cheese Pizza2","Tasty, Delicious Pizza!!!","https://chatpatidiary.files.wordpress.com/2015/01/dsc_1769.jpg",[
  //     new Ingredient("Meat2",500,Units.mg),
  //     new Ingredient("French Fries2",20,Units.unit),
  //   ]),
  //   new Recipe("Cheese Pizza3","Tasty, Delicious Pizza!!!","https://chatpatidiary.files.wordpress.com/2015/01/dsc_1769.jpg",[
  //     new Ingredient("Meat3",500,Units.mg),
  //     new Ingredient("French Fries3",20,Units.unit),
  //   ]),
  //   new Recipe("Cheese Pizza4","Tasty, Delicious Pizza!!!","https://chatpatidiary.files.wordpress.com/2015/01/dsc_1769.jpg",[
  //     new Ingredient("Meat",500,Units.mg),
  //     new Ingredient("French Fries",20,Units.unit),
  //   ]),
  // ];
  
  private recipes:Recipe[] = [];

  constructor(private store:Store<fromApp.IAppState>){}

  // RETURNING RECIPES COPY
  getRecipes(){
    return this.recipes.slice();
  }

  // RETURNING SINGLE RECIPE
  getRecipe(index:number){
    return this.recipes[index];
  }

  // SET RECIPES
  setRecipes(recipes:Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  // ADD RECIPE
  addRecipe(newRecipe:Recipe):void{
    this.recipes.push(newRecipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  // UPDATE RECIPE
  updateRecipe(index:number,newRecipe:Recipe):void{
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  // DELETE RECIPE
  deleteRecipe(index:number):void{
    this.recipes.splice(index,1);
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients:Ingredient[]){
    // this.slService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }
}