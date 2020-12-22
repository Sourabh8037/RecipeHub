import { Units } from '../../shared/enums';
import { Ingredient } from '../../shared/Ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface IShoppingListState{
  ingredients:Ingredient[];
  editedIngredient:Ingredient;
  editedIngredientIndex:number;
}

const initialState:IShoppingListState= {
  ingredients :  [
    new Ingredient("Cheese",50,Units.mg),
    new Ingredient("Tomatoes",300,Units.mg),
  ],
  editedIngredient:null,
  editedIngredientIndex:-1
}

export type ShoppingListMethods = ShoppingListActions.AddIngredient | ShoppingListActions.AddIngredients | ShoppingListActions.UpdateIngredient | ShoppingListActions.DeleteIngredient | ShoppingListActions.StartEdit |ShoppingListActions.StopEdit;

const addIngredient = (state,action) =>{ 
  const updatedState = {...state,ingredients:[...state.ingredients,action.payload]}
  return updatedState;
}

const addIngredients = (state,action) =>{
  const updatedState = {...state,ingredients:[...state.ingredients,...action.payload]};
  return updatedState;
}

const updateIngredient = (state,action) =>{
  const newIngs = state.ingredients[state.editedIngredientIndex];
  const updatedIng = {
    ...newIngs,
    ...action.payload
  };
  const updatedIngs = [...state.ingredients];
  updatedIngs[state.editedIngredientIndex] = updatedIng;
  return {...state,ingredients:updatedIngs,editedIngredient:null,editedIngredientIndex:-1};
}

const deleteIngredient = (state,action) =>{
  console.log("delete ingredietn");
  const updatedState = {...state,ingredients:state.ingredients.filter((item,index)=>index !== state.editedIngredientIndex),editedIngredient:null,editedIngredientIndex:-1};
  console.log(updatedState);
  return updatedState;
}

const startEdit = (state,action) =>{
  console.log("start edit");
  const updatedState = {...state,
  editedIngredientIndex:action.payload,
  editedIngredient:{...state.ingredients[action.payload]}
}
console.log(updatedState.editedIngredient);
return updatedState;
}

const stopEdit = (state,action) =>{
  console.log("stop edit");
  return {...state,editedIngredient:null,editedIngredientIndex:-1};
}

export function shoppingListReducer(state:IShoppingListState=initialState,action:ShoppingListMethods){
  switch(action.type){
    case ShoppingListActions.ADD_INGREDIENT: return addIngredient(state,action);
    case ShoppingListActions.ADD_INGREDIENTS: return addIngredients(state,action);
    case ShoppingListActions.UPDATE_INGREDIENT: return updateIngredient(state,action);
    case ShoppingListActions.DELETE_INGREDIENT: return deleteIngredient(state,action);
    case ShoppingListActions.START_EDIT: return startEdit(state,action);
    case ShoppingListActions.STOP_EDIT: return stopEdit(state,action);
    default:return state;
  }
}