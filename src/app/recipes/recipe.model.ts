import { Ingredient } from '../models/ingredient.model';

export class Recipe {
  public name: string;
  public description: string;
  public shortDesc: string;
  public imagePath: string;
  public ingredients: Ingredient[];

  constructor(
    name: string,
    description: string,
    shortDesc: string,
    imagePath: string,
    ingredients: Ingredient[]
  ) {
    this.name = name;
    this.description = description;
    this.shortDesc = shortDesc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}
