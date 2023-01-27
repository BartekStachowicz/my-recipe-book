import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/services/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  databaseURL =
    'https://recipe-project-database-5cfc2-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storageData() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.databaseURL, recipes).subscribe();
  }

  fetchData() {
    return this.http.get<Recipe[]>(this.databaseURL).pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => this.recipeService.setRecipes(recipes))
    );
  }
}
