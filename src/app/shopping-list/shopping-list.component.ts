import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';
import {
  animate,
  group,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  animations: [
    trigger('shList', [
      state(
        'dummy',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('void => *', [
        animate(
          500,
          keyframes([
            style({
              transform: 'translateY(-50px)',
              opacity: 0,
              offset: 0,
            }),
            style({
              transform: 'translateY(-25px)',
              opacity: 0.5,
              offset: 0.3,
            }),
            style({
              transform: 'translateY(-10px)',
              opacity: 1,
              offset: 0.6,
            }),
            style({
              transform: 'translateY(0px)',
              opacity: 1,
              offset: 1,
            }),
          ])
        ),
      ]),
      transition('* => void', [
        group([
          animate(
            300,
            style({
              color: 'red',
            })
          ),
          animate(
            600,
            style({
              transform: 'translateX(100px)',
              opacity: 0,
            })
          ),
        ]),
      ]),
    ]),
  ],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy(): void {}
}
