
import { ActivationEnd } from '@angular/router';
import { Recipe } from '../recipe-model';
import * as RecipeActions from './recipe.actions';

export interface IRecipeState{
  recipes:Recipe[];
}

const initialState:IRecipeState={
  recipes:null,
}

const setRecipes=(state:IRecipeState,action)=>({...state,recipes:action.payload});

const addRecipe=(state:IRecipeState,action)=>({...state,recipes:[...state.recipes,action.payload]});

const updateRecipe=(state:IRecipeState,action)=>{
  const updatedRecipe:Recipe = {...state.recipes[action.payload.index],
  ...action.payload.recipe};
  const updatedRecipes = [...state.recipes];
  updatedRecipes[action.payload.index] = updatedRecipe;
  return {...state,recipes:updatedRecipes};
}

const deleteRecipe=(state,action)=>({...state,recipes:state.recipes.filter((item,index)=>index!==action.payload)});

export const recipeReducer = (state:IRecipeState=initialState,action:RecipeActions.RecipeActions) =>{
  switch(action.type){
    case RecipeActions.SET_RECIPES: return setRecipes(state,action);
    case RecipeActions.ADD_RECIPE: return addRecipe(state,action);
    case RecipeActions.UPDATE_RECIPE: return updateRecipe(state,action);
    case RecipeActions.DELETE_RECIPE: return deleteRecipe(state,action);
  }
  return state;
}