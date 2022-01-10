import AComponent from "../core/AComponent";
import {MaterialPower} from "./dic/material_power";
import React from "react";
import {RecipeElement, RecipeLineElement} from "./RecipeLineElement";

type CRecipeLineElementProps = {
    line: RecipeLineElement;
    index: number;
};
type CRecipeLineElementState = {
    expand: boolean;
};

export class CRecipeLineElement extends AComponent<CRecipeLineElementProps, CRecipeLineElementState> {
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