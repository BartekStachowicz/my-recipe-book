import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/models/ingredient.model';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  editingSub: Subscription;
  editMode = false;
  editingItemIndex: number;
  editedItem: Ingredient;
  @ViewChild('form', { static: false }) shoppingFrom: NgForm;

  constructor(private shoppingService: ShoppingListService) {}

  ngOnInit() {
    this.editingSub = this.shoppingService.editing.subscribe(
      (index: number) => {
        this.editingItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingService.getIngerdient(index);
        this.shoppingFrom.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
          unit: this.editedItem.unit,
        });
      }
    );
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount, value.unit);
    if (this.editMode) {
      this.shoppingService.updateIng(this.editingItemIndex, newIngredient);
    } else {
      this.shoppingService.addIngredient(newIngredient);
    }
    this.onClear();
  }

  onClear() {
    this.shoppingFrom.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingService.deleteIng(this.editingItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.editingSub.unsubscribe();
  }
}
