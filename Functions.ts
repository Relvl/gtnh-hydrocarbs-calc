import {Material, Materials, Recipe, Recipes} from "./gtnh/materials";

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

function recurse(target: Material, lines: Array<Array<Recipe>>, previousLine: Array<Recipe>) {
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

                recurse(source.material, lines, newLine);
            });
    });
}

export function testRun() {
    console.log("start");
    const source = Materials.HEAVY_OIL;
    const target = Materials.ETHYLENE;
    // Это начальные рецепты. Всё, что в результате даёт искомый материал-цель (этилен).
    // По сути это финальное количество линий. И эти линии нужно продлить до материала-сырца (нефть).
    // Нужно взять все комбинации, длящиеся до материала, у которого нет рецепта, а потом отфильтровать те, у которых последний рецепт не содержит материал-сырец в списке сырцов.

    // Рекурсивно бредем по всем сырцам рецепта, ищем их рецепты, и на каждый копируем предыдущую линию и дополняем список линий ею.
    const firstLine: Array<Recipe> = [];
    const lines: Array<Array<Recipe>> = [firstLine];
    recurse(target, lines, firstLine);

    lines.filter(line => {
        if (!line.length) return false;
        return line[line.length - 1].sources.containsEx(s => s.material == source);
    }).map(line => {
        let totalRatio = 1;
        let i = 0;
        let recipe = line[0];
        let uTarget = target;
        while (i < line.length) {
            const nextRecipe = line[i + 1];
            // Находим сырец, который есть в таргетах следующего рецепта.
            const uSource = nextRecipe ? nextRecipe.targets.intersectionEx(recipe.sources, e => e.material.id)[0].material : source;
            const ratio = recipe.getRatio(uSource, uTarget);
            totalRatio = totalRatio * ratio;
            recipe = nextRecipe;
            uTarget = uSource;
            i++;
        }
        return {line, totalRatio};
    }).sort((a, b) => b.totalRatio - a.totalRatio).forEach(r => {
        console.log("---", `[${r.totalRatio.toFixed(4)}]`, r.line.map(r => r.toString()));
    });
}