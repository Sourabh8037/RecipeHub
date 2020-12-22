import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipe-model';
import '../../../styles.css';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[] = null;
  subscription:Subscription;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private store:Store<fromApp.IAppState> 
    ) { }

  ngOnInit(): void {
    this.subscription = this.store.select('recipe').subscribe(recipeData=>{
      this.recipes = recipeData.recipes;
    })
  }

  onNewRecipe = () =>{
    this.router.navigate(['new'],{relativeTo:this.route})
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
