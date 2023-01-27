import { Subject } from 'rxjs';
import { Ingredient } from 'src/app/models/ingredient.model';

export class ShoppingListService {
  ingChanged = new Subject<Ingredient[]>();
  editing = new Subject<number>();
  private ingredients: Ingredient[] = [];

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingChanged.next(this.ingredients.slice());
  }

  addIngredientsFromRecipe(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingChanged.next(this.ingredients.slice());
  }

  getIngerdient(index: number) {
    return this.ingredients[index];
  }

  updateIng(index: number, newIng: Ingredient) {
    this.ingredients[index] = newIng;
    this.ingChanged.next(this.ingredients.slice());
  }

  deleteIng(index: number) {
    this.ingredients.splice(index, 1);
    this.ingChanged.next(this.ingredients.slice());
  }
}
