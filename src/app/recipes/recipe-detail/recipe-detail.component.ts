import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipe-model';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import '../../../styles.css';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent implements OnInit {
  selectedRecipe:Recipe;
  id:number;
  
  constructor(private route:ActivatedRoute,
    private router:Router,
    private store:Store<fromApp.IAppState>
    ){}

  ngOnInit(): void {
    this.route.params.pipe(
      map(params=>+params['id']),
      switchMap(id =>{
        this.id = id;
        return this.store.select('recipe')}),
      map(recipeState=>{
        return recipeState.recipes.find((item,index)=>index===this.id);
      })
    ).subscribe(recipe=>{
      this.selectedRecipe = recipe;
    })
  }

  onAddToShoppingList(){
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.selectedRecipe.ingredients));
  }

  onEditRecipe = () =>{
    this.router.navigate([`edit`],{relativeTo:this.route});
  }

  onDeleteRecipe = () =>{
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
