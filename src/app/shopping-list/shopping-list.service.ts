import { Subject } from 'rxjs';
import { Units } from '../shared/enums';
import { Ingredient } from '../shared/Ingredient.model';

export class ShoppingListService{

  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients : Ingredient[] = [
    new Ingredient("Cheese",50,Units.mg),
    new Ingredient("Tomatoes",300,Units.mg),
  ];

  // RETURN COPY OF INGREDIENTS ARRAY
  getIngredients():Ingredient[]{
    return this.ingredients.slice();
  }

  //RETURNS COPY OF INGREDIENT
  getIngredient(index:number):Ingredient{
    return this.ingredients[index];
  }

  // ADD INGREDIENT
  addIngredient(ingredient : Ingredient):void{
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  // ADD INGREDIENTS
  addIngredients(ingredients:Ingredient[]):void{
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  
  // UPDATE INGREDIENT
  updateIngredient( index:number, ingredient:Ingredient ):void{
    this.ingredients[index] = ingredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  // DELETE INGREDIENT
  deleteIngredient( index:number):void{
    this.ingredients.splice(index,1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

}