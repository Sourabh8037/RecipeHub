import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Units } from 'src/app/shared/enums';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipe-model';
import * as RecipeActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html'
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id:number;
  editMode:boolean = false;
  units = Units;
  recipeForm:FormGroup;
  recipe:Recipe;
  private subscription:Subscription;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private store:Store<fromApp.IAppState>
    ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params:Params)=>{
      this.id = +params['id'];
      this.editMode = params['id'] != null ? true : false;
      this.initForm();
    })
  }

  private initForm():void{    
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    if(this.editMode){
      this.subscription = this.store.select('recipe').pipe(map(recipeData=>recipeData.recipes.find((item,index)=>index===this.id))).subscribe(recipe=>{ 
      this.recipe = recipe;
      recipeName = this.recipe.name;
      recipeImagePath = this.recipe.imagePath;
      recipeDescription = this.recipe.description;
      if(this.recipe.ingredients){
        for(let ing of this.recipe.ingredients){
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ing.name,Validators.required),
              'amount': new FormControl(ing.amount,[Validators.required,Validators.pattern(/^[0-9]+[0-9]*$/)
              ]),
              'unit': new FormControl(ing.unit,Validators.required)
            })
          )
        }
      }
      });
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName,Validators.required),
      'imagePath': new FormControl(recipeImagePath,Validators.required),
      'description': new FormControl(recipeDescription,Validators.required),
      'ingredients': recipeIngredients
    })
  }

  onSubmit():void{
    this.editMode ? 
    this.store.dispatch(new RecipeActions.UpdateRecipe({index:this.id,recipe:this.recipeForm.value})) :
    this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
    this.onCancel();
  }
  onAddIngredient():void{
  (<FormArray>this.recipeForm.get('ingredients')).push(
    new FormGroup({
      'name':new FormControl(null,Validators.required),
      'amount':new FormControl(null,[
        Validators.required,
        Validators.pattern(/^[0-9]+[0-9]*$/)
      ]),
      'unit':new FormControl(this.units.unit,Validators.required)
    })
  )
  }

  onCancel():void{
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  onDeleteIngredient(index:number):void{
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  ngOnDestroy(){
    if(this.subscription)
    this.subscription.unsubscribe();
  }
}
