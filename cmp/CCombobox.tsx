import AComponent from "../core/AComponent";
import IComponentProps from "../core/IComponentProps";
import IComponentState from "../core/IComponentState";
import * as React from "react";
import {HTMLAttributes} from "react";
import {CIcon} from "./CIcon";

export class CComboboxValue<ID = string, ATT = any> {
    id: ID;
    label: React.ReactNode;
    attach?: ATT | null;

    constructor(id: ID, label: React.ReactNode, attach: ATT | null = null) {
        this.id = id;
        this.label = label;
        this.attach = attach;
    }

    render() {
        return <div key={`${this.id}`}>{this.label.toString()}</div>;
    }

    checkFilter(filter: string): boolean {
        return this.id.toString().contains(filter, true) || this.label.toString().contains(filter, true);
    }
}

type Props<ID = string, ATT = any> = {
    label: React.ReactNode;
    placeholder?: string;

    values: Array<CComboboxValue<ID, ATT>>;
    selected: ID;
    onSelected: (id: ID, value: CComboboxValue<ID, ATT>, attach: ATT) => void;

    disabled?: boolean;
    autoFocus?: boolean;
};
type State<ID, ATT> = {
    expanded: boolean;
    focused: boolean;

    filterValue: string;
    subselectItemIndex: number;
} & IComponentState;

export class CCombobox<ID = string, ATT = any> extends AComponent<Props<ID, ATT> & HTMLAttributes<HTMLDivElement> & IComponentProps, State<ID, ATT>> {
    private readonly comboboxId: string;

    constructor(props: Props<ID, ATT> & HTMLAttributes<HTMLDivElement> & IComponentProps) {
        super(props);
        this.comboboxId = props.id || `c-combobox-${window.idGenerator.next().value}`;
        this.state = {...this.state, expanded: false, filterValue: ""};
    }

    private rootRef: HTMLDivElement | null = null;
    private inputRef: HTMLInputElement | null = null;

    handleBodyClick = (event: React.MouseEvent<HTMLElement>) => {
        if ((event.target as HTMLElement).closest(".c-combobox") != this.rootRef) {
            this.setState({expanded: false});
            this.getApplication().deregisterBodyClick(this.handleBodyClick);
        }
    };

    componentDidMount() {
        super.componentDidMount();
        if (this.props.autoFocus) {
            this.handleExpand();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    componentDidUpdate(prevProps: Props<ID, ATT> & HTMLAttributes<HTMLDivElement> & IComponentProps, prevState: State<ID, ATT>) {
        super.componentDidUpdate(prevProps, prevState);

        if (this.detectPropsChanges(prevProps, "selected")) {
        }

        if (this.detectStateChanges(prevState, "expanded")) {
            if (this.state.expanded) {
                this.getApplication().registerBodyClick(this.handleBodyClick);
            }
            this.setState({filterValue: ""});
        }
    }

    handleExpand = () => {
        if (this.props.disabled) {
            return;
        }
        if (this.state.expanded) {
            return;
        }
        this.setState({expanded: true});
    };
    handleDropDownButton = () => {
        if (this.state.expanded) {
            this.setState({expanded: false});
        } else {
            this.handleExpand();
        }
    };

    handleSelectItem = (value: CComboboxValue<ID, ATT>) => {
        this.setState({expanded: false});
        if (this.props.onSelected) {
            if (value) {
                this.props.onSelected(value.id, value, value.attach);
            } else {
                this.props.onSelected(null, null, null);
            }
        }
    };

    renderSelectedValue(selectedValue: CComboboxValue<ID, ATT>) {
        if (this.state.expanded) {
            return (
                <input
                    autoFocus
                    id={this.comboboxId}
                    type="text"
                    value={this.state.filterValue}
                    onChange={event => this.setState({filterValue: event.target.value || ""})}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled}
                    ref={ref => (this.inputRef = ref)}
                />
            );
        }

        return (
            <div className="selected-value-container" onClick={this.handleExpand}>
                {selectedValue && selectedValue.render()}
            </div>
        );
    }

    render() {
        const selectedValue = this.props.values.find(v => v.id == this.props.selected);
        const {id, label, placeholder, values, selected, onSelected, disabled, autoFocus, className, ...comboboxProps} = {...this.props};

        return (
            <div
                className={window.className(className, "c-combobox", {expanded: this.state.expanded, "has-value": !!selectedValue, disabled})}
                {...comboboxProps}
                ref={ref => (this.rootRef = ref)}
                data-selection-prevent=""
            >
                <label htmlFor={this.comboboxId} onClick={this.handleExpand}>
                    {this.props.label}
                </label>

                {this.renderSelectedValue(selectedValue)}

                <CIcon icon="icon-play3" size="large" className="open-dd-button" onClick={this.handleDropDownButton} />

                <div className={"combobox-drop-down"}>
                    <div className="overflow-wrapper">
                        {this.props.values
                            .filter(value => !this.state.filterValue || value.checkFilter(this.state.filterValue))
                            .map((value, idx) => (
                                <div
                                    className={window.className("dd-item", {
                                        selected: selectedValue == value,
                                        subselected: this.state.subselectItemIndex === idx,
                                    })}
                                    key={`combo-value-${String(value.id)}`}
                                    onClick={this.handleSelectItem.bind(this, value)}
                                >
                                    {value.label}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
}
