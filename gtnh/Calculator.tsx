import AComponent from "../core/AComponent";
import IComponentState from "../core/IComponentState";
import React from "react";
import {CCombobox, CComboboxValue} from "../cmp/CCombobox";
import CButton from "../cmp/CButton";
import {CCheckbox} from "../cmp/CCheckbox";
import {recursiveExtendRecipes} from "./Functions";
import {Materials} from "./dic/materials";
import {Recipe} from "./Recipe";
import {Recipes} from "./dic/recipes";
import {Material} from "./Material";

type RecipeElement = {
    recipe: Recipe;
    ratio: number;
};
type RecipeLineElement = {
    totalRatio: number;
    recipes: Array<RecipeElement>;
}

type State = {
    selectedSource: keyof typeof Materials;
    selectedTarget: keyof typeof Materials;
    results: Array<RecipeLineElement>;
} & IComponentState;

export class Calculator extends AComponent<{}, State> {

    constructor(props: any) {
        super(props);
        this.setState({
            selectedSource: "BC_OIL",
            selectedTarget: "ETHYLENE",
            results: []
        });
    }

    polymers = Object.values(Materials).filter(m => m.tier > 0).map(m => new CComboboxValue<keyof typeof Materials>(m.id as keyof typeof Materials, m.name));

    recursiveCollect = (target: Material, currentLine: Array<RecipeElement>, lines: Array<Array<RecipeElement>>, fromSource: Material) => {
        // Берем список рецептов, производящих запрошенный результат.
        const recipes = Recipes.filter(recipe => recipe.targets.containsEx(t => t.material == target));
        recipes.forEach((recipe, idxRec) => {
            // Если это не-первый рецепт - делаем копию линии и используем уже её.
            if (idxRec != 0) {
                currentLine = Object.assign([], currentLine);
                lines.push(currentLine);
            }

            currentLine.push({recipe, ratio: 0});

            recipe.sources
                .filter(s => s.material.tier < target.tier) // Только с понижением сложности - иначе будет циклическая рекурсия.
                .forEach((sourceVol, idxSource) => {

                    // Если это не-первый сорец - делаем копию линии и используем уже её.
                    if (idxSource != 0) {
                        currentLine = Object.assign([], currentLine);
                        lines.push(currentLine);
                    }

                    this.recursiveCollect(sourceVol.material, currentLine, lines, target);
                });
        });
    };

    handleStartNew = () => {
        const source = Object.values(Materials).find(m => m.id == this.state.selectedSource);
        const target = Object.values(Materials).find(m => m.id == this.state.selectedTarget);

        const firstLine: Array<RecipeElement> = [];
        const lines: Array<Array<RecipeElement>> = [firstLine];

        this.recursiveCollect(target, firstLine, lines, target);

        console.log(lines.map(l => l.map(ll => ll.recipe.toStringSimple())))/*FIXME Убрать!*/;
    };

    handleStart = () => {
        this.setState({results: []});

        this.handleStartNew();

        return;

        const source = Object.values(Materials).find(m => m.id == this.state.selectedSource);
        const target = Object.values(Materials).find(m => m.id == this.state.selectedTarget);
        // Это начальные рецепты. Всё, что в результате даёт искомый материал-цель (этилен).
        // По сути это финальное количество линий. И эти линии нужно продлить до материала-сырца (нефть).
        // Нужно взять все комбинации, длящиеся до материала, у которого нет рецепта, а потом отфильтровать те, у которых последний рецепт не содержит материал-сырец в списке сырцов.

        // Рекурсивно бредем по всем сырцам рецепта, ищем их рецепты, и на каждый копируем предыдущую линию и дополняем список линий ею.
        const firstLine: Array<Recipe> = [];
        const lines: Array<Array<Recipe>> = [firstLine];
        recursiveExtendRecipes(target, lines, firstLine);

        lines
            .filter(line => !line.length ? false : line[line.length - 1].sources.containsEx(s => s.material == source))
            .map(line => {
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

    };

    render() {
        return <section>
            <header>GT: New Horizons hydrocarbons calculator</header>

            <p className="text-grey-small margin-bottom-l">
                This calculator calculates the optimal scheme for the production of the specified polymer from the specified raw materials, shows productivity, energy consumption, as well as energy production in
                generators per unit of raw material.
            </p>

            <div className="flex-row grid-col-12 margin-bottom-l">
                <div className="flex-col grid-col-8">
                    <div className="flex-row">
                        <CCombobox<keyof typeof Materials> label="Source" values={this.polymers} selected={this.state.selectedSource} onSelected={selectedSource => this.setState({selectedSource})}
                                                           className="grid-col-6"/>
                        <CCombobox<keyof typeof Materials> label="Target" values={this.polymers} selected={this.state.selectedTarget} onSelected={selectedTarget => this.setState({selectedTarget})}
                                                           className="grid-col-6"/>
                    </div>
                    <div className="flex-row margin-top-m">
                        <CCheckbox label="Use Distillation Tower" checked={false} onAction={checked => {}} disabled className="grid-col-6"/>
                        <CCheckbox label="Search for bertter energy production" checked={false} onAction={checked => {}} disabled className="grid-col-6"/>
                    </div>
                    <div className="flex-row margin-top-m">
                        <CCheckbox label="Use Oil Cracking Unit" checked={false} onAction={checked => {}} disabled className="grid-col-6"/>
                    </div>
                    <div className="flex-row margin-top-m">
                        <CCheckbox label="Use Pyrolize Oven" checked={true} onAction={checked => {}} disabled className="grid-col-6" title="Unblocks wood/coal sources"/>
                    </div>
                </div>
                <div className="flex-row flex-full-center grid-col-4">
                    <CButton label="Start" onClick={this.handleStart}/>
                </div>
            </div>

            {!this.state.results || !this.state.results.length ? null : <div className="margin-all-bottom-xs">
                {this.state.results.map((r, idx) => (<CRecipeLineElement recipe={r} key={idx}/>))}
            </div>}
        </section>;
    }
}

type CRecipeLineElementProps = {
    recipe: RecipeLineElement;
};

class CRecipeLineElement extends AComponent<CRecipeLineElementProps> {
    render() {
        return <div className="bordered-block">

        </div>;
    }
}