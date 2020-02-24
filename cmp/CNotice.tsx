import AComponent from "../core/AComponent";
import * as React from "react";
import IComponentProps from "../core/IComponentProps";
import IComponentState from "../core/IComponentState";

export enum NoticeStyle {
    NORMAL,
    SUCCESS,
    WARNING,
    ERROR,
}

type Props = {
    label?: React.ReactNode;
    message: React.ReactNode;
    noticeStyle: NoticeStyle;
} & IComponentProps &
    React.HTMLAttributes<HTMLDivElement>;
type State = {} & IComponentState;

export class CNotice extends AComponent<Props, State> {
    static defaultProps = {
        noticeStyle: NoticeStyle.NORMAL,
    };

    render() {
        const {className, label, message, noticeStyle, ...noticeProps} = {...this.props};

        return (
            <div className={window.className("c-notice", `c-notice-style-${noticeStyle}`, className)} {...noticeProps}>
                {label ? <header>{label}</header> : null}
                <div>{message}</div>
            </div>
        );
    }
}
