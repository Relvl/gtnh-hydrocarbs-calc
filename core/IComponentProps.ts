import {CSSProperties, default as React} from "react";

export default interface IComponentProps {
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
}