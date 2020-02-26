import {Material} from "./Material";
import {Recipes} from "./dic/recipes";
import {Recipe} from "./Recipe";

export function findRecipeLines(source: Material, target: Material) {
    const tragetRecipes = Recipes.filter(r => r.hasResult(target));
    console.log(tragetRecipes.map(r => r.toString()));
    console.log("------------------");
    const lines: Array<Array<Recipe>> = [];
    tragetRecipes.forEach(recipe => {
        // Этот рецепт содержит целевой материал.
        // Берем все его сырцы и ищем по рецептам.
        // Если сырец - требуемый, то добавляем к результату.

        const line: Array<Recipe> = [recipe];
        extendRecipeLine(recipe, source, line);

        if (line.length > 1) {
            lines.push(line);
        }
    });

    return lines;
}

function extendRecipeLine(recipe: Recipe, neededSource: Material, collector: Array<Recipe>) {
    recipe.sources.forEach(target => {
        const targetRecipes = Recipes.filter(r => r.hasResult(target.material));
        targetRecipes.forEach(nestedRecipe => {
            collector.push(nestedRecipe);

            // Если рецепт не содержит искомый сырец - рекурсивно ищем дальше.
            if (!nestedRecipe.sources.containsEx(s => s.material == neededSource)) {
                extendRecipeLine(nestedRecipe, neededSource, collector);
            }
        });
    });
}

export function recursiveExtendRecipes(target: Material, lines: Array<Array<Recipe>>, previousLine: Array<Recipe>) {
    // Рецепты, производящие целевой материал.
    const recipes = Recipes.filter(r => r.hasResult(target));
    recipes.forEach(recipe => {
        // На каждый рецепт создаем новую линию и добавляем её в список.
        const newLine = Object.assign([] as Array<Recipe>, previousLine);
        lines.push(newLine);
        newLine.push(recipe);
        // Нельзя использовать рецепты, которые повышают сложность полимера - так появится бесконечная рекурсия.
        // Например, дистилиз нафты даёт тяжелое топливо, а дистилиз тяжелого топлива даёт нафту.
        recipe.sources
            .filter(s => s.material.tier <= target.tier)
            .forEach(source => {

                recursiveExtendRecipes(source.material, lines, newLine);
            });
    });
}
