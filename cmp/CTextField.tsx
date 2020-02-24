import AComponent from "../core/AComponent";
import * as React from "react";
import {InputHTMLAttributes} from "react";
import IComponentState from "../core/IComponentState";

export type TextFieldValidatorType =
    | {
          valid: boolean | null | undefined;
          tip?: React.ReactNode;
      }
    | string;

export function TextFieldValidatorIsInvalid(validator: TextFieldValidatorType): boolean {
    if (!validator) {
        return false;
    } else if (typeof validator == "string") {
        return !!validator;
    } else {
        return validator.valid == false;
    }
}

type Props = {
    label: React.ReactNode;
    valid?: TextFieldValidatorType;
    password?: boolean;

    onChangeText: (value: string) => void;
    onReturnKey?: (value: string) => void;

    autoFocus?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;
type State = {
    inputId: string;
    isHovered: boolean;
    isFocused: boolean;
} & IComponentState;

export class CTextField extends AComponent<Props, State> {
    private inputRef: HTMLInputElement | undefined = undefined;

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

    private handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChangeText(event.target.value || "");
    };

    private handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.keyCode) {
            case 10 /*RETURN*/:
            case 13 /*ENTER*/: {
                this.props.onReturnKey && this.props.onReturnKey(String(this.props.value));
            }
        }
    };

    setFocus = () => {
        if (this.inputRef) {
            this.inputRef.focus();
        }
    };

    render(): React.ReactNode {
        const {label, className, style, onFocus, onBlur, password, onChangeText, onReturnKey, autoFocus, ...inputProps} = {...this.props};
        const onFocusInternal = (event: React.FocusEvent<HTMLInputElement>) => {
            this.setState({isFocused: true});
            onFocus && onFocus(event);
        };
        const onBlurInternal = (event: React.FocusEvent<HTMLInputElement>) => {
            this.setState({isFocused: false});
            onBlur && onBlur(event);
        };
        return (
            <div
                onMouseEnter={() => this.setState({isHovered: true})}
                onMouseLeave={() => this.setState({isHovered: false})}
                className={window.className(className, "c-text-field", {
                    "is-focused": this.state.isFocused,
                    "has-value": !!this.props.value,
                    "is-valid": this.isValid(),
                    "is-invalid": TextFieldValidatorIsInvalid(this.props.valid),
                    "disabled": this.props.disabled
                })}
                style={style}
                data-selection-prevent=""
            >
                <label htmlFor={this.state.inputId}>{label}</label>
                <input
                    {...inputProps}
                    id={this.state.inputId}
                    type={password ? "password" : "text"}
                    onFocus={onFocusInternal}
                    onBlur={onBlurInternal}
                    onChange={this.handleOnChange}
                    onKeyDown={this.handleKeyDown}
                    ref={ref => (this.inputRef = ref)}
                />

                {this.isValid() || this.isInvalid() ? (
                    <div className="validation-tip-container">{typeof this.props.valid == "string" ? this.props.valid : this.props.valid.tip}</div>
                ) : null}
            </div>
        );
    }
}
