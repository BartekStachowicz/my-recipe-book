import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  disabledSave = false;
  isAuthenticated = false;
  private userSub: Subscription;
  private recipeSub: Subscription;
  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }

  onManage() {
    this.recipeSub = this.store.select('recipes').subscribe((data) => {
      if (data.recipes.length === 0) {
        this.disabledSave = true;
      } else {
        this.disabledSave = false;
      }
    });
  }

  onStorageData() {
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  onNewRecipe() {
    this.router.navigate(['recipes/new-recipe']);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
