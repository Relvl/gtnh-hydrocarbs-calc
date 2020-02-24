import AComponent from "../core/AComponent";
import React from "react";
import IComponentProps from "../core/IComponentProps";

type Props = {
    message?: React.ReactNode;
    type: "div" | "section";
    children: undefined;
};

export default class Loading extends AComponent<Props & IComponentProps> {
    static defaultProps: Required<Props> = {
        message: "Подождите, идёт загрузка...",
        type: "div",
        children: undefined,
    };

    render() {
        const ElementType = this.props.type;
        return (
            <ElementType className="flex-row-center">
                <div className="flex-no-shrink">
                    <svg className={window.className("spinner_new medium", this.props.className)}>
                        <circle cx="20px" cy="20px" r="19px" stroke="#70F" />
                        <circle cx="20px" cy="20px" r="10px" stroke="#FF4F12" />
                    </svg>
                </div>
                <div className="flex-max-grow margin-left-m">{this.props.message}</div>
            </ElementType>
        );
    }
}
