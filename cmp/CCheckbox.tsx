import AComponent from "../core/AComponent";
import IComponentProps from "../core/IComponentProps";
import IComponentState from "../core/IComponentState";
import * as React from "react";
import {HTMLAttributes} from "react";

type Props = {
    label: React.ReactNode;
    disabled?: boolean;
    checked: boolean;
    onAction: (checked: boolean) => void;
} & HTMLAttributes<HTMLDivElement>;
type State = {
    id: string;
} & IComponentState;

export class CCheckbox extends AComponent<Props & IComponentProps, State> {
    private readonly comboboxId: string;

    constructor(props: Props & IComponentProps) {
        super(props);
        this.comboboxId = props.id || `c-checkbox-${window.idGenerator.next().value}`;
    }

    private animationRef: HTMLDivElement | null = null;

    private handleInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.disabled) {
            return false;
        }
        this.props.onAction(event.target.checked);
        this.animationRef!.classList.remove("animate-ripple");
        setTimeout(() => this.animationRef.classList.add("animate-ripple"), 1);
    };

    render() {
        const {id, label, disabled, checked, onAction, className, ...wrapperProps} = {...this.props};
        return (
            <div className={window.className("c-checkbox", className, {disabled})} {...wrapperProps} data-selection-prevent="">
                <div className={window.className("facade", {checked, "right-margin": !!label})}>
                    <div className="animation-element" ref={ref => (this.animationRef = ref)} />
                    {checked ? <div className="check-mark" /> : null}
                </div>

                <input id={this.comboboxId} type="checkbox" checked={this.props.checked} onChange={this.handleInputChanged} tabIndex={this.props.tabIndex} />

                {this.props.label ? <label htmlFor={this.comboboxId}>{this.props.label}</label> : null}
            </div>
        );
    }
}
