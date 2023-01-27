import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { RecipeService } from '../recipes/services/recipe.service';
import { DataStorageService } from '../services/data-storage.service';

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
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
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
