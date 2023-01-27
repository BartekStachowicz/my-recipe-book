import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from 'src/app/models/ingredient.model';
import { ShoppingListService } from 'src/app/shopping-list/services/shopping-list.service';
import { Recipe } from '../recipe.model';
@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [];
  recipesChanged = new Subject<Recipe[]>();

  constructor(private shoppingService: ShoppingListService) {
    // this.recipes.push(
    //   new Recipe(
    //     'Pierogi',
    //     'This is a test',
    //     'https://c.pxhere.com/images/97/2b/ffbc276d664a6acade96b75e11e4-1620746.jpg!d',
    //     [
    //       new Ingredient('Flour', 1, 'kg'),
    //       new Ingredient('Cottage cheese', 2, 'kg'),
    //       new Ingredient('Onion', 3, 'pieces'),
    //     ]
    //   )
    // );
    // this.recipes.push(
    //   new Recipe(
    //     'Lasagne',
    //     'This is another test',
    //     'https://c.pxhere.com/photos/2b/35/lasagna_noodles_cheese_tomatoes_baking_dish_ceramic_mould_scalloped_food-879810.jpg!d',
    //     [
    //       new Ingredient('Pasta', 1, 'package'),
    //       new Ingredient('Meat', 2, 'kg'),
    //       new Ingredient('Tomatoes', 5, 'pieces'),
    //     ]
    //   )
    // );
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addToShoppingList(ingredients: Ingredient[]) {
    this.shoppingService.addIngredientsFromRecipe(ingredients);
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged();
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipeChanged();
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged();
  }

  isRecipesEmpty() {
    if (this.recipes.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  private recipeChanged() {
    this.recipesChanged.next(this.recipes.slice());
  }
}
