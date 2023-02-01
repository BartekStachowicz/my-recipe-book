import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { RecipeService } from '../recipes/services/recipe.service';
import { DataStorageService } from '../services/data-storage.service';
import * as AuthActions from '../auth/store/auth.actions';

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
  constructor(
    private dataStorage: DataStorageService,
    private recipeService: RecipeService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
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
    if (this.recipeService.isRecipesEmpty()) {
      this.disabledSave = true;
    } else {
      this.disabledSave = false;
    }
  }

  onStorageData() {
    this.dataStorage.storageData();
  }

  onFetchData() {
    this.dataStorage.fetchData().subscribe(() => {
      this.disabledSave = false;
    });
  }

  onLogout() {
    // this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
