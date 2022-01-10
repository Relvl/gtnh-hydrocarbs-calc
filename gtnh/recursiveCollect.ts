import {Material} from "./Material";
import {RecipeElement, RecipeLineElement} from "./RecipeLineElement";
import {Recipes} from "./dic/recipes";

export const recursiveCollect = (target: Material, currentLine: Array<RecipeElement>, lines: Array<Array<RecipeElement>>, crackingPassed = 0) => {
    // Берем список рецептов, производящих запрошенный результат.
    const recipes = Recipes.filter(recipe => recipe.targets.containsEx(t => t.material == target));

    if (!recipes.length && target.tier > 0 && currentLine.length) {
        lines.push(currentLine);
    }

    let localCrackingPassed = crackingPassed;
    recipes.forEach((recipe) => {
        let bypassTriggered = false;
        recipe.sources
            // Без повышения сложности - иначе будет циклическая рекурсия.
            // Для крекинга придется делать исключение.
            .filter(s => {
                const isLowerTier = s.material.tier <= target.tier;
                if (!isLowerTier) {
                    localCrackingPassed++;
                    return crackingPassed < 3;
                }
                return isLowerTier;
            })
            .forEach((sourceVol) => {
                const copy = Object.assign([], currentLine);
                copy.push({recipe, ratio: recipe.getRatio(sourceVol.material, target)});
                recursiveCollect(sourceVol.material, Object.assign([], copy), lines, localCrackingPassed);
            });
    });
};

export const recursiveCollectSort = (lines: Array<Array<RecipeElement>>) => lines
    .map(line => {
        let totalRatio = 1;
        line.forEach(r => (totalRatio *= r.ratio));
        return {
            recipes: line,
            totalRatio,
        } as RecipeLineElement;
    })
    .sort((a, b) => b.totalRatio - a.totalRatio);