import AComponent from "../core/AComponent";
import IComponentState from "../core/IComponentState";
import React from "react";
import {CComboboxValue, Combobox} from "../cmp/Combobox";
import Button from "../cmp/Button";
import {Checkbox} from "../cmp/Checkbox";
import {Materials} from "./dic/materials";
import {Material} from "./Material";
import {Machine} from "./Machine";
import {CRecipeLineElement} from "./CRecipeLineElement";
import {RecipeElement, RecipeLineElement} from "./RecipeLineElement";
import {recursiveCollect, recursiveCollectSort} from "./recursiveCollect";

type State = {
    selectedSource: keyof typeof Materials;
    selectedTarget: keyof typeof Materials;
    results: Array<RecipeLineElement>;
    useOnlyTarget: boolean;
    usePyrolize: boolean;
} & IComponentState;

const polymers = Object.values(Materials)
    .filter(m => m.tier > 0 && m.tier < 90)
    .sort((a,b) => b.tier - a.tier)
    .map(m => new CComboboxValue<keyof typeof Materials, Material>(m.id as keyof typeof Materials, m.name, m));

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

    handleStart = () => {
        const {results, loading, error, ...store} = {...this.state};
        window.localStorage.setItem("config", JSON.stringify(store));

        this.setState({results: []});
        const source = Object.values(Materials).find(m => m.id == this.state.selectedSource);
        const target = Object.values(Materials).find(m => m.id == this.state.selectedTarget);

        // Все доступные пути от сорца до таргета
        const lines: Array<Array<RecipeElement>> = [];
        recursiveCollect(target, [], lines);
        this.setState({results: recursiveCollectSort(lines)});
    };

    render() {
        return (
            <section>
                <header>GT: New Horizons hydrocarbons calculator</header>

                <p className="text-grey-small margin-bottom-s">
                    This program calculates the optimal scheme for the production of the specified polymer from the specified raw materials, shows productivity, energy
                    consumption, as well as energy production in generators per unit of raw material.
                </p>
                <p className="text-grey-small margin-bottom-l">
                    Prodiction lines restricted at maximum 3 stages of cracking (in cause of latancy issues).
                </p>

                <div className="flex-row grid-col-12 margin-bottom-l">
                    <div className="flex-col grid-col-8">
                        <div className="flex-row">
                            <Combobox<keyof typeof Materials>
                                label="Source"
                                values={polymers.filter(p => p.attach.tier == 1)}
                                selected={this.state.selectedSource}
                                onSelected={selectedSource => this.setState({selectedSource})}
                                disabled={this.state.useOnlyTarget}
                                className="grid-col-6"
                            />
                            <Combobox<keyof typeof Materials>
                                label="Target"
                                values={polymers.filter(p => p.attach.tier > 1)}
                                selected={this.state.selectedTarget}
                                onSelected={selectedTarget => this.setState({selectedTarget})}
                                className="grid-col-6"
                            />
                        </div>
                        <div className="flex-row">
                            <div className="grid-col-6 flex-col margin-all-bottom-xs">
                                <Checkbox
                                    label="Use Distillation Tower"
                                    checked={false}
                                    onAction={checked => {
                                    }}
                                    disabled
                                    title="Use Distillation Towers instead of all singleblock Distillery"
                                />
                                <Checkbox
                                    label="Allow Pyrolize Oven"
                                    checked={this.state.usePyrolize || false}
                                    onAction={usePyrolize => this.setState({usePyrolize})}
                                    title="Allow Pyrolize Oven recipes"
                                />
                            </div>
                            <div className="grid-col-6 flex-col margin-all-bottom-xs">
                                <Checkbox
                                    label="Use only target"
                                    checked={this.state.useOnlyTarget || false}
                                    onAction={useOnlyTarget => this.setState({useOnlyTarget})}
                                    title="Do ignore source filtering - shows all available routes for target production"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-row flex-full-center grid-col-4">
                        <Button label="Start" onClick={this.handleStart} />
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
                                <CRecipeLineElement line={r} index={idx} key={idx} />
                            ))}
                    </div>
                )}
            </section>
        );
    }
}

