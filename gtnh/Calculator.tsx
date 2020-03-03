import AComponent from "../core/AComponent";
import IComponentState from "../core/IComponentState";
import React from "react";
import {CCombobox, CComboboxValue} from "../cmp/CCombobox";
import CButton from "../cmp/CButton";
import {CCheckbox} from "../cmp/CCheckbox";
import {Materials} from "./dic/materials";
import {Recipe} from "./Recipe";
import {Recipes} from "./dic/recipes";
import {Material} from "./Material";
import {Machine} from "./Machine";
import {MaterialPower} from "./dic/material_power";

type RecipeElement = {
    recipe: Recipe;
    ratio: number;
};
type RecipeLineElement = {
    totalRatio: number;
    recipes: Array<RecipeElement>;
};

type State = {
    selectedSource: keyof typeof Materials;
    selectedTarget: keyof typeof Materials;
    results: Array<RecipeLineElement>;
    useOnlyTarget: boolean;
    usePyrolize: boolean;
} & IComponentState;

export class Calculator extends AComponent<{}, State> {
    constructor(props: any) {
        super(props);
        this.setState(
            Object.assign(
                {
                    selectedSource: "BC_OIL",
                    selectedTarget: "ETHYLENE",
                    results: [],
                },
                JSON.parse(window.localStorage.getItem("config") || "{}") || {},
            ),
        );
    }

    polymers = Object.values(Materials)
        .filter(m => m.tier > 0)
        .map(m => new CComboboxValue<keyof typeof Materials, Material>(m.id as keyof typeof Materials, m.name, m));

    recursiveCollect = (target: Material, currentLine: Array<RecipeElement>, lines: Array<Array<RecipeElement>>) => {
        // Берем список рецептов, производящих запрошенный результат.
        const recipes = Recipes.filter(recipe => recipe.targets.containsEx(t => t.material == target));

        if (!recipes.length && target.tier > 0 && currentLine.length) {
            lines.push(currentLine);
        }

        recipes.forEach((recipe, idxRec) => {
            recipe.sources
                .filter(s => s.material.tier <= target.tier) // Без повышения сложности - иначе будет циклическая рекурсия.
                .forEach((sourceVol, idxSource) => {
                    const copy = Object.assign([], currentLine);
                    copy.push({recipe, ratio: recipe.getRatio(sourceVol.material, target)});
                    this.recursiveCollect(sourceVol.material, Object.assign([], copy), lines);
                });
        });
    };

    handleStart = () => {
        const {results, loading, error, ...store} = {...this.state};
        window.localStorage.setItem("config", JSON.stringify(store));

        this.setState({results: []});
        const source = Object.values(Materials).find(m => m.id == this.state.selectedSource);
        const target = Object.values(Materials).find(m => m.id == this.state.selectedTarget);

        // All available routes for target. Need to filter it with compare to source!
        const lines: Array<Array<RecipeElement>> = [];
        this.recursiveCollect(target, [], lines);

        this.setState({
            results: lines
                .map(line => {
                    let totalRatio = 1;
                    line.forEach(r => (totalRatio *= r.ratio));
                    return {
                        recipes: line,
                        totalRatio,
                    } as RecipeLineElement;
                })
                .sort((a, b) => b.totalRatio - a.totalRatio),
        });
    };

    render() {
        return (
            <section>
                <header>GT: New Horizons hydrocarbons calculator</header>

                <p className="text-grey-small margin-bottom-l">
                    This calculator calculates the optimal scheme for the production of the specified polymer from the specified raw materials, shows productivity, energy
                    consumption, as well as energy production in generators per unit of raw material.
                </p>

                <div className="flex-row grid-col-12 margin-bottom-l">
                    <div className="flex-col grid-col-8">
                        <div className="flex-row">
                            <CCombobox<keyof typeof Materials>
                                label="Source"
                                values={this.polymers}
                                selected={this.state.selectedSource}
                                onSelected={selectedSource => this.setState({selectedSource})}
                                disabled={this.state.useOnlyTarget}
                                className="grid-col-6"
                            />
                            <CCombobox<keyof typeof Materials>
                                label="Target"
                                values={this.polymers.filter(p => p.attach.tier > 1)}
                                selected={this.state.selectedTarget}
                                onSelected={selectedTarget => this.setState({selectedTarget})}
                                className="grid-col-6"
                            />
                        </div>
                        <div className="flex-row">
                            <div className="grid-col-6 flex-col margin-all-bottom-xs">
                                <CCheckbox
                                    label="Use Distillation Tower"
                                    checked={false}
                                    onAction={checked => {}}
                                    disabled
                                    title="Use Distillation Towers instead of all singleblock Distillery"
                                />
                                <CCheckbox
                                    label="Allow Pyrolize Oven"
                                    checked={this.state.usePyrolize || false}
                                    onAction={usePyrolize => this.setState({usePyrolize})}
                                    title="Allow Pyrolize Oven recipes"
                                />
                            </div>
                            <div className="grid-col-6 flex-col margin-all-bottom-xs">
                                <CCheckbox
                                    label="Use only target"
                                    checked={this.state.useOnlyTarget || false}
                                    onAction={useOnlyTarget => this.setState({useOnlyTarget})}
                                    title="Do ignore source filtering - shows all available routes for target production"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-row flex-full-center grid-col-4">
                        <CButton label="Start" onClick={this.handleStart}/>
                    </div>
                </div>

                {!this.state.results || !this.state.results.length ? null : (
                    <div className="margin-all-bottom-xs">
                        {this.state.results
                            .filter(
                                r =>
                                    (this.state.useOnlyTarget ? true : !!r.recipes[r.recipes.length - 1].recipe.sources.containsEx(s => s.material.id == this.state.selectedSource)) &&
                                    (this.state.usePyrolize ? true : !r.recipes.some(rr => rr.recipe.process == Machine.PyrolizeOven)),
                            )
                            .slice(0, 10)
                            .map((r, idx) => (
                                <CRecipeLineElement line={r} index={idx} key={idx}/>
                            ))}
                    </div>
                )}
            </section>
        );
    }
}

type CRecipeLineElementProps = {
    line: RecipeLineElement;
    index: number;
};
type CRecipeLineElementState = {
    expand: boolean;
};

class CRecipeLineElement extends AComponent<CRecipeLineElementProps, CRecipeLineElementState> {
    componentDidMount() {
        super.componentDidMount();
        this.setState({expand: this.props.index == 0});
    }

    renderContent() {
        if (!this.state.expand) {
            return null;
        }
        const totalLinePower = this.props.line.recipes.reduce((memo, r) => memo + r.recipe.power, 0);

        return (
            <div className="margin-left-m">
                {Object.assign([] as Array<RecipeElement>, this.props.line.recipes)
                    .reverse()
                    .map((recipe, idx, list) => {
                        const sourcePower = MaterialPower[recipe.recipe.targets[0].material.id];
                        const sp = sourcePower ? sourcePower.power * this.props.line.totalRatio : 0;

                        return (
                            <div className="flex-row-center border-bottom-line" key={recipe.recipe.toStringSimple()}>
                                <div className="grid-col-3 margin-all-bottom-xs">
                                    {recipe.recipe.sources.map(s => (
                                        <div key={s.toString()}>
                                            {s.material.name} <span className="text-grey-smallest"> * {s.volume}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid-col-1">⇒</div>
                                <div className="grid-col-3 margin-all-bottom-xs">
                                    {recipe.recipe.targets.map(s => (
                                        <div key={s.toString()}>
                                            {s.material.name} <span className="text-grey-smallest"> * {s.volume}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex-row text-grey-smallest grid-col-5">
                                    <div className="grid-col-6">
                                        <div>Ratio: {recipe.ratio.toFixed(4)}</div>
                                        <div>Power: {recipe.recipe.power} eu/t</div>
                                        <div>Machine: {recipe.recipe.process}</div>
                                    </div>
                                    {idx == list.length - 1 ? (
                                        <div>
                                            {sourcePower ? <div title="per 1 piece/bucket/cell of the source">Est. energy production: {sp.toFixed(0)} eu</div> : null}
                                            <div>Total line power: {totalLinePower} eu/t</div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
            </div>
        );
    }

    render() {
        const first = this.props.line.recipes[0].recipe;
        const last = this.props.line.recipes[this.props.line.recipes.length - 1].recipe;
        return (
            <div className="bordered-block">
                <header>
                    {first.targets.find(t => t.material.tier > 0).material.name} from {last.sources.find(t => t.material.tier > 0).material.name} with ratio{" "}
                    {this.props.line.totalRatio.toFixed(4)}
                    {this.state.expand ? (
                        <span className="text-grey-smallest el-action-popup margin-left-s" onClick={() => this.setState({expand: false})}>
                            Collapse
                        </span>
                    ) : (
                        <span className="text-grey-smallest el-action-popup margin-left-s" onClick={() => this.setState({expand: true})}>
                            Expand
                        </span>
                    )}
                </header>
                {this.renderContent()}
            </div>
        );
    }
}
