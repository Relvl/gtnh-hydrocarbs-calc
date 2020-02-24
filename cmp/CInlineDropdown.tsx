import AComponent from "../core/AComponent";
import React, {HTMLAttributes} from "react";
import IComponentProps from "../core/IComponentProps";

type Props = {
    values: Array<{id: string; title: string}>;
    selected: string;
    onAction: (id: string) => void;
    isBlock?: boolean;
} & HTMLAttributes<HTMLPreElement> &
    IComponentProps;

export class CInlineDropdown extends AComponent<Props, {expanded: boolean}> {
    private rootRef: HTMLPreElement | null = null;
    handleSelected = (event: React.MouseEvent<HTMLPreElement>, id: string) => {
        this.setState({expanded: false});
        this.props.onAction(id);
    };
    handleBodyClick = (event: React.MouseEvent<HTMLElement>) => {
        if ((event.target as HTMLElement).closest(".c-inline-dropdown") != this.rootRef) {
            this.setState({expanded: false});
            this.getApplication().deregisterBodyClick(this.handleBodyClick);
        }
    };
    handleExpand = () => {
        if (!this.state.expanded) {
            this.setState({expanded: true});
        }
    };

    componentDidUpdate(prevProps: any, prevState: any) {
        super.componentDidUpdate(prevProps, prevState);
        if (this.detectStateChanges(prevState, "expanded")) {
            if (this.state.expanded) {
                this.getApplication().registerBodyClick(this.handleBodyClick);
            }
        }
    }

    render() {
        const {className, children, values, selected, onAction, isBlock, ...props} = {...this.props};
        return (
            <pre
                className={window.className("c-inline-dropdown", className, {code: isBlock, "code-inline": !isBlock})}
                onClick={this.handleExpand}
                ref={ref => (this.rootRef = ref)}
                {...props}
            >
                {this.props.values.find(v => v.id == this.props.selected).title}
                {this.state.expanded ? (
                    <div className="dropdown-menu">
                        {this.props.values.map(v => (
                            <pre className="code-inline" onClick={e => this.handleSelected(e, v.id)}>
                                {v.title}
                            </pre>
                        ))}
                    </div>
                ) : null}
            </pre>
        );
    }
}
