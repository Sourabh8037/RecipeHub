import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable} from 'rxjs';
import { Ingredient } from '../shared/Ingredient.model';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';
import '../../styles.css';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
})
export class ShoppingListComponent implements OnInit{

  ingredients : Observable<{ingredients:Ingredient[]}>;
  constructor(private store:Store<fromApp.IAppState>) { }

  ngOnInit(): void {
    this.ingredients =  this.store.select('shoppingList');
  }

  onSelectItem(index:number){
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
