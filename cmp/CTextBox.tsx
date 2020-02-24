import AComponent from "../core/AComponent";
import * as React from "react";
import {InputHTMLAttributes} from "react";
import IComponentState from "../core/IComponentState";
import {TextFieldValidatorIsInvalid, TextFieldValidatorType} from "./CTextField";

type Props = {
    label: React.ReactNode;
    valid?: TextFieldValidatorType;
    onChangeText: (value: string) => void;
    autoFocus?: boolean;
} & InputHTMLAttributes<HTMLTextAreaElement>;
type State = {
    inputId: string;
    isHovered: boolean;
    isFocused: boolean;
} & IComponentState;

export class CTextBox extends AComponent<Props, State> {
    private inputRef: HTMLTextAreaElement | undefined = undefined;

    constructor(props: Props) {
        super(props);
        this.state = {
            ...this.state,
            inputId: this.props.id || `input-id-${window.idGenerator.next().value}`,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.autoFocus) {
            this.setFocus();
        }
    }

    private isValid = () => !!this.props.valid && typeof this.props.valid != "string" && this.props.valid.valid == true;
    private isInvalid = () => !!this.props.valid && (typeof this.props.valid == "string" || this.props.valid.valid == false);

    private handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.props.onChangeText(event.target.value || "");
    };

    setFocus = () => {
        if (this.inputRef) {
            this.inputRef.focus();
        }
    };

    render(): React.ReactNode {
        const {label, className, style, onFocus, onBlur, onChangeText, autoFocus, ...inputProps} = {...this.props};
        const onFocusInternal = (event: React.FocusEvent<HTMLTextAreaElement>) => {
            this.setState({isFocused: true});
            onFocus && onFocus(event);
        };
        const onBlurInternal = (event: React.FocusEvent<HTMLTextAreaElement>) => {
            this.setState({isFocused: false});
            onBlur && onBlur(event);
        };
        return (
            <div
                onMouseEnter={() => this.setState({isHovered: true})}
                onMouseLeave={() => this.setState({isHovered: false})}
                className={window.className(className, "c-text-box", {
                    "is-focused": this.state.isFocused,
                    "has-value": !!this.props.value,
                    "is-valid": this.isValid(),
                    "is-invalid": TextFieldValidatorIsInvalid(this.props.valid),
                    disabled: this.props.disabled,
                })}
                style={style}
                data-selection-prevent=""
            >
                <label htmlFor={this.state.inputId}>{label}</label>
                <textarea
                    {...inputProps}
                    id={this.state.inputId}
                    onFocus={onFocusInternal}
                    onBlur={onBlurInternal}
                    onChange={this.handleOnChange}
                    ref={ref => (this.inputRef = ref)}
                />

                {this.isValid() || this.isInvalid() ? (
                    <div className="validation-tip-container">{typeof this.props.valid == "string" ? this.props.valid : this.props.valid.tip}</div>
                ) : null}
            </div>
        );
    }
}
