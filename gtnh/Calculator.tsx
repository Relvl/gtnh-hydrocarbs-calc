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
    useOnlyTarget: boolean;
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

    recursiveCollect = (target: Material, currentLine: Array<RecipeElement>, lines: Array<Array<RecipeElement>>) => {
        // Берем список рецептов, производящих запрошенный результат.
        const recipes = Recipes.filter(recipe => recipe.targets.containsEx(t => t.material == target));

        if (!recipes.length && target.tier > 0 && currentLine.length) {
            lines.push(currentLine);
        }

        recipes.forEach((recipe, idxRec) => {
            recipe.sources
                .filter(s => s.material.tier < target.tier) // Только с понижением сложности - иначе будет циклическая рекурсия.
                .forEach((sourceVol, idxSource) => {
                    const copy = Object.assign([], currentLine);
                    copy.push({recipe, ratio: recipe.getRatio(sourceVol.material, target)});
                    this.recursiveCollect(sourceVol.material, Object.assign([], copy), lines);
                });
        });
    };

    handleStart = () => {
        this.setState({results: []});
        const source = Object.values(Materials).find(m => m.id == this.state.selectedSource);
        const target = Object.values(Materials).find(m => m.id == this.state.selectedTarget);

        // All available routes for target. Need to filter it with compare to source!
        const lines: Array<Array<RecipeElement>> = [];
        this.recursiveCollect(target, [], lines);

        const linesCalculated = lines
            .filter(line => this.state.useOnlyTarget ? true : line[line.length - 1].recipe.sources.containsEx(s => s.material == source))
            .map(line => {
                let totalRatio = 1;
                line.forEach(r => totalRatio *= r.ratio);
                return {
                    recipes: line,
                    totalRatio
                } as RecipeLineElement;
            })
            .sort(((a, b) => b.totalRatio - a.totalRatio))
            .slice(0, 10);

        console.log(linesCalculated.map(line => {
            return [line.totalRatio.toFixed(4), line.recipes.map(ll => {
                return `[${ll.ratio.toFixed(4)}] ${ll.recipe.toStringSimpleReversed()}`;
            })];
        }));

        this.setState({results: linesCalculated});
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
                                                           disabled={this.state.useOnlyTarget}
                                                           className="grid-col-6"/>
                        <CCombobox<keyof typeof Materials> label="Target" values={this.polymers} selected={this.state.selectedTarget} onSelected={selectedTarget => this.setState({selectedTarget})}
                                                           className="grid-col-6"/>
                    </div>
                    <div className="flex-row">
                        <div className="grid-col-6 flex-col margin-all-bottom-xs">
                            <CCheckbox label="Use Distillation Tower" checked={false} onAction={checked => {}} disabled/>
                            <CCheckbox label="Use Oil Cracking Unit" checked={false} onAction={checked => {}} disabled/>
                            <CCheckbox label="Use Pyrolize Oven" checked={true} onAction={checked => {}} disabled title="Unblocks wood/coal sources"/>
                        </div>
                        <div className="grid-col-6 flex-col margin-all-bottom-xs">
                            <CCheckbox label="Search for bertter energy production" checked={false} onAction={checked => {}} disabled/>
                            <CCheckbox label="Use only target" checked={this.state.useOnlyTarget || false} onAction={useOnlyTarget => this.setState({useOnlyTarget})}
                                       title="Do ignore source filtering - shows all available routes for target production"/>
                        </div>
                    </div>
                </div>
                <div className="flex-row flex-full-center grid-col-4">
                    <CButton label="Start" onClick={this.handleStart}/>
                </div>
            </div>

            {!this.state.results || !this.state.results.length ? null : <div className="margin-all-bottom-xs">
                {this.state.results.map((r, idx) => (<CRecipeLineElement line={r} index={idx} key={idx}/>))}
            </div>}
        </section>;
    }
}

type CRecipeLineElementProps = {
    line: RecipeLineElement;
    index: number;
};
type CRecipeLineElementState = {
    expand: boolean;
}

class CRecipeLineElement extends AComponent<CRecipeLineElementProps, CRecipeLineElementState> {
    componentDidMount() {
        super.componentDidMount();
        this.setState({expand: this.props.index == 0});
    }

    renderContent() {
        if (!this.state.expand) { return null; }
        return <div className="margin-left-m">
            {this.props.line.recipes.reverse().map(recipe => {
                return <p key={recipe.recipe.toStringSimple()}>{
                    recipe.recipe.sources.map(s => `${s.volume} ${s.material.name}`).join(" + ")
                } => {
                    recipe.recipe.targets.map(s => `${s.volume} ${s.material.name}`).join(" + ")
                } <span className="text-grey-smallest">ratio: {recipe.ratio.toFixed(4)}, power: {recipe.recipe.power} eu/t, machine: {recipe.recipe.process}</span></p>;
            })}
        </div>;
    }

    render() {
        const first = this.props.line.recipes[0].recipe;
        const last = this.props.line.recipes[this.props.line.recipes.length - 1].recipe;
        return <div className="bordered-block">
            <header>
                {first.targets.find(t => t.material.tier > 0).material.name} from {last.sources.find(t => t.material.tier > 0).material.name} with ratio {this.props.line.totalRatio.toFixed(4)}
                {this.state.expand ?
                    <span className="text-grey-smallest el-action-popup margin-left-s" onClick={() => this.setState({expand: false})}>Collapse</span> :
                    <span className="text-grey-smallest el-action-popup margin-left-s" onClick={() => this.setState({expand: true})}>Expand</span>}
            </header>
            {this.renderContent()}
        </div>;
    }
}