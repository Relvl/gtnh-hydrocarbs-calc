import * as React from "react";
import IComponentState from "./core/IComponentState";
import AComponent from "./core/AComponent";
import {Calculator} from "./gtnh/Calculator";

type State = {} & IComponentState;

export class Application extends AComponent<{}, State> {
    private bodyClickListeners: Array<(event: React.MouseEvent<HTMLElement>) => void> = [];

    constructor(props: any) {
        super(props);
        AComponent.getApplication = () => this;
        //Application.engine.stateMachine.pushState(new ApplicationStateMachine());
        // @ts-ignore - нету типов...
        svg4everybody();
    }

    componentDidMount() {
        super.componentDidMount();
        window.document.addEventListener("click", this.onDocumentBodyClickCapturing, true);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        window.document.removeEventListener("click", this.onDocumentBodyClickCapturing, true);
    }

    private onDocumentBodyClickCapturing(this: Document, e: any) {
        AComponent.getApplication().bodyClickListeners.forEach(lis => lis && lis(e));
    }

    registerBodyClick = (lis: (event: React.MouseEvent<HTMLElement>) => void) => this.bodyClickListeners.push(lis);
    deregisterBodyClick = (lis: (event: React.MouseEvent<HTMLElement>) => void) => {
        this.bodyClickListeners.forEach((l, idx) => {
            if (l == lis) {
                delete this.bodyClickListeners[idx];
            }
        });
        this.bodyClickListeners = this.bodyClickListeners.filter(e => !!e);
    };

    render() {
        return (
            <div className="page-wrapper">
                <Calculator />
                <div className="text-grey-smallest margin-top-m">
                    This site uses{" "}
                    <a href="https://en.wikipedia.org/wiki/HTTP_cookie" target="_blank">
                        cookie
                    </a>{" "}
                    and{" "}
                    <a href="https://en.wikipedia.org/wiki/Web_storage#Local_and_session_storage" target="_blank">
                        local storage
                    </a>{" "}
                    files. Do not press "Start" if you dont accept this files.
                </div>
            </div>
        );
    }
}

/** Создаёт новый массив и сливает в него последовательно содержимое всех входящих массивов. */
export function mergeArrays<T>(...arrays: Array<ReadonlyArray<T>>): Array<T> {
    let result: Array<T> = [];
    arrays.forEach((array, idx) => {
        if (idx == 0) {
            result = Object.assign(result, array);
        } else {
            result = result.concat(array);
        }
    });
    return result;
}

export function uniqueArray<T = any>(array: ReadonlyArray<T>, uniq: (element: T) => string): Array<T> {
    return Object.values(
        array.reduce((memo: {[key: string]: T}, element: T) => {
            if (!memo[uniq(element)]) {
                memo[uniq(element)] = element;
            }
            return memo;
        }, {})
    );
}

export function groupArray<T>(array: ReadonlyArray<T>, keyMaker: (element: T) => string): {[key: string]: Array<T>} {
    const result: {[key: string]: Array<T>} = {};
    array.forEach(element => {
        const key = keyMaker(element);
        let grouped = result[key];
        if (!grouped) {
            grouped = [];
            result[key] = grouped;
        }
        grouped.push(element);
    });
    return result;
}

export function mapObjectToArray<T, N>(object: {[key: string]: T}, map: (element: T, key: string) => N): Array<N> {
    return Object.keys(object).map(key => map(object[key], key));
}

export function mapObjectToObject<T, N>(object: {[key: string]: T}, map: (element: T, key: string) => N): {[key: string]: N} {
    return Object.keys(object).reduce((memo, key) => ({...memo, [key]: map(object[key], key)}), {});
}

export function flatternArray<T>(array: Array<Array<T>>): Array<T> {
    return [].concat(...array);
}
