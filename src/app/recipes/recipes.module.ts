import { RouterModule } from '@angular/router';
import { RecipesRoutingModule } from './recipes-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipesComponent } from './recipes.component';
import { StartRecipesComponent } from './start-recipes/start-recipes.component';
import { SharedModule } from '../shared.module';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    StartRecipesComponent,
    RecipeEditComponent,
  ],
  imports: [
    RecipesRoutingModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxEditorModule,
  ],
  providers: [],
})
export class RecipesModule {}
