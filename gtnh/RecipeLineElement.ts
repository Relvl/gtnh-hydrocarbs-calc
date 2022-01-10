import {Recipe} from "./Recipe";

export type RecipeElement = {
    recipe: Recipe;
    ratio: number;
};

export type RecipeLineElement = {
    totalRatio: number;
    recipes: Array<RecipeElement>;
};