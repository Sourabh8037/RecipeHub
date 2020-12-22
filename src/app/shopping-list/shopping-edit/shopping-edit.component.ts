import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Units } from 'src/app/shared/enums';
import { Ingredient } from 'src/app/shared/Ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import '../../../styles.css';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  
  @ViewChild('f') slForm : NgForm;
  subscription : Subscription;
  units = Units;
  editMode = false;
  editedItem:Ingredient;

  constructor(private store:Store<fromApp.IAppState>) { }
  
  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData=>{
      if(stateData.editedIngredientIndex >-1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name:this.editedItem.name,
          amount:this.editedItem.amount,
          unit:this.editedItem.unit
        })
      }else{
        this.editMode = false;
      }
    })
  }

  onSubmit(form : NgForm){
    const value = form.value;
    const ing = new Ingredient(value.name,value.amount,value.unit);
    this.editMode ? 
    this.store.dispatch(new ShoppingListActions.UpdateIngredient(ing)):
    this.store.dispatch(new ShoppingListActions.AddIngredient(ing));
    this.slForm.reset();
    this.editMode = false;
  }

  onClear():void{
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete():void{
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

}
