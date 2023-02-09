import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import { Subscription } from 'rxjs';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: 'recipe-edit.component.html',
  styleUrls: ['recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  private storeSubscription: Subscription;

  editor: Editor;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
    this.editor = new Editor();
  }

  private initForm() {
    let recipeName = '';
    let recipeImgPath = '';
    let shortDesc = '';
    let description = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSubscription = this.store
        .select('recipes')
        .pipe(
          map((recipesState) => {
            return recipesState.recipes.find(
              (recipe, index) => index === this.id
            );
          })
        )
        .subscribe((recipe) => {
          recipeName = recipe.name;
          recipeImgPath = recipe.imagePath;
          description = recipe.description;
          shortDesc = recipe.shortDesc;
          if (recipe['ingredients']) {
            recipe.ingredients.forEach((el) => {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(el.name, Validators.required),
                  amount: new FormControl(el.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                  ]),
                  unit: new FormControl(el.unit, Validators.required),
                })
              );
            });
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      description: new FormControl(description, Validators.required),
      shortDesc: new FormControl(shortDesc, Validators.required),
      imagePath: new FormControl(recipeImgPath, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(
        new RecipesActions.UpdateRecipe({
          index: this.id,
          recipe: this.recipeForm.value,
        })
      );
      this.store.dispatch(new RecipesActions.StoreRecipes());
    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
      this.store.dispatch(new RecipesActions.StoreRecipes());
    }
    this.onCancel();
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
        unit: new FormControl(null, Validators.required),
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIng(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onClearIngredients() {
    (<FormArray>this.recipeForm.get('ingredients')).clear();
  }

  ngOnDestroy(): void {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
    this.editor.destroy();
  }
}
