import AComponent from "../core/AComponent";
import * as React from "react";
import {ButtonHTMLAttributes} from "react";

export enum CButtonStyle {
    NORMAL,
    CANCEL,
    RED,
}

export type CButtonProps = {
    label?: React.ReactNode;
    children?: React.ReactNode;
    buttonStyle: CButtonStyle;
    waiting?: boolean;
};
type State = {};

export default class CButton extends AComponent<CButtonProps & ButtonHTMLAttributes<HTMLButtonElement>, State> {
    static defaultProps = {
        buttonStyle: CButtonStyle.NORMAL,
    };
    private static rippleSize = 100;
    private static rippleAnumationTime = 20;

    rippleElement?: HTMLDivElement = undefined;

    render(): React.ReactNode {
        const {label, children, className, onClick, buttonStyle, waiting, ...buttonProps} = {...this.props};
        const onClickWrapper = (event: React.MouseEvent<HTMLButtonElement>) => {
            if (this.props.disabled || waiting) {
                return false;
            }

            this.rippleElement!.classList.remove("animate");
            this.rippleElement!.removeAttribute("style");
            let x = event.nativeEvent.offsetX,
                y = event.nativeEvent.offsetY;
            setTimeout(() => {
                if (this.isComponentMounted) {
                    this.rippleElement!.setAttribute("style", `top: ${y - CButton.rippleSize / 2}px; left:${x - CButton.rippleSize / 2}px;`);
                    this.rippleElement!.classList.add("animate");
                }
            }, CButton.rippleAnumationTime);

            onClick && onClick(event);
        };
        return (
            <button
                {...buttonProps}
                onClick={onClickWrapper}
                className={window.className(className, "c-button", `c-button-style-${buttonStyle}`)}
                disabled={buttonProps.disabled || waiting}
                data-selection-prevent=""
            >
                <div className="anim-ripple" ref={ref => (this.rippleElement = ref)} />
                <div className="content">
                    <div className="controls-container">
                        {waiting ? (
                            <svg className="spinner_new small">
                                <circle cx="12px" cy="12px" r="10px" stroke="#FF4F12" />
                            </svg>
                        ) : null}
                    </div>
                    {label || children}
                </div>
            </button>
        );
    }
}
