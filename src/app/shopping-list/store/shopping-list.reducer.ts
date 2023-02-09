import { Ingredient } from '../../models/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngIndex: number;
}

const initState: State = {
  ingredients: [
    new Ingredient('Dummy', 1, 'kg'),
    new Ingredient('Dummy', 1, 'litre'),
    new Ingredient('Dummy', 5, 'grams'),
    new Ingredient('Dummy', 10, 'pieces'),
  ],
  editedIngredient: null,
  editedIngIndex: -1,
};

export function shoppingListReducer(
  state: State = initState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngIndex];
      const updatedIng = {
        ...ingredient,
        ...action.payload,
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngIndex] = updatedIng;
      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngIndex: -1,
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter(
          (_, index) => index !== state.editedIngIndex
        ),
        editedIngredient: null,
        editedIngIndex: -1,
      };

    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] },
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngIndex: -1,
      };
    default:
      return state;
  }
}
