import * as React from "react";
import {Application} from "../Application";
import IComponentProps from "./IComponentProps";
import IComponentState from "./IComponentState";
import Deferred from "./Deferred";
import deepEqual from "deep-equal";

export default abstract class AComponent<P = IComponentProps, S = IComponentState, KKK = S & IComponentState> extends React.Component<P & IComponentProps, KKK> {
    protected isComponentMounted: boolean = false;

    constructor(props: P) {
        super(props);
        this.isComponentMounted = false;
        this.state = {
            ...this.state,
            loading: true,
            error: undefined,
        };
    }

    abstract render(): React.ReactNode;

    setState<K extends keyof KKK>(state: ((prevState: Readonly<KKK>, props: Readonly<P>) => Pick<KKK, K> | KKK | null) | (Pick<KKK, K> | KKK | null), callback?: () => void): void;
    setState<K extends keyof KKK>(
        state: ((prevState: Readonly<KKK>, props: Readonly<P>) => Pick<KKK, K> | KKK | null) | (Pick<KKK, K> | KKK | null),
        callback?: () => void,
    ): Promise<void>;
    setState<K extends keyof KKK>(
        state: ((prevState: Readonly<KKK>, props: Readonly<P>) => Pick<KKK, K> | KKK | null) | (Pick<KKK, K> | KKK | null),
        callback?: () => void,
    ): Promise<void> {
        const deferred = new Deferred();
        if (this.isComponentMounted) {
            super.setState(state, () => {
                deferred.resolve();
                callback && callback();
            });
        } else {
            this.state = {...this.state, ...state};
            callback && callback();
        }
        return deferred;
    }

    setStatePromised<K extends keyof KKK>(state: ((prevState: Readonly<KKK>, props: Readonly<P>) => Pick<KKK, K> | KKK | null) | (Pick<KKK, K> | KKK | null)): Promise<void> {
        const deferred = new Deferred();
        if (this.isComponentMounted) {
            super.setState(state, () => deferred.resolve());
        } else {
            this.state = {...this.state, ...state};
        }
        this.setState(state, () => deferred.resolve());
        return deferred;
    }

    componentDidMount() {
        this.isComponentMounted = true;
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    componentDidUpdate(prevProps: P & IComponentProps, prevState: KKK) {
    }

    detectStateChanges(prevState: KKK, ...fields: Array<keyof KKK>): boolean {
        return fields.some(field => !deepEqual(this.state[field], prevState[field]));
    }

    detectPropsChanges(prevProps: P & IComponentProps, ...fields: Array<keyof (P & IComponentProps)>) {
        return fields.some(field => deepEqual(this.props[field], prevProps[field]));
    }

    static getApplication = (): Application => null;
    getApplication = (): Application => AComponent.getApplication();

}
