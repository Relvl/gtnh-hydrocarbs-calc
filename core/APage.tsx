import AComponent from "./AComponent";
import IComponentState from "./IComponentState";
import * as React from "react";
import Loading from "../cmp/Loading";
import {RouteComponentProps} from "react-router";

export default abstract class APage<S extends IComponentState = IComponentState, Params extends {[K in keyof Params]?: string} = {}> extends AComponent<
    RouteComponentProps<Params>,
    S
> {
    protected abstract pageTitle: React.ReactNode | null;
    private renderOfSubClass: () => React.ReactNode = this.render;
    protected preloadingMessage: String = "Подождите, идёт загрузка необходимой информации...";

    protected constructor(props: any) {
        super(props);
        // Подмена рендера субкласса на обертку, позволяющую показать крутилку во время загрузки промисов.
        this.render = this.renderWrapper;
    }

    getParameter(key: keyof Params): string | undefined {
        return this.props.match.params[key];
    }

    /** @deprecated Не наследуйте это! Если нужен запрос - registerPreloading, если нужен момент завершения загрузки - componentDidPreloaded. */
    componentDidMount() {
        super.componentDidMount();
        this.reloadPreloading();
    }

    protected reloadPreloading = () =>
        this.setStatePromised({loading: true})
            .then(() => Promise.all(this.registerPreloading()))
            .then(() => this.setState({loading: false}))
            .then(() => this.componentDidPreloaded())
            .catch(error => this.setState({error}));

    /** Регистрация промисов, завершение которых необходимо для завершения стадии загрузки страницы. */
    registerPreloading(): Array<Promise<any>> {
        return [];
    }

    /** Вызывается после завершения всех промисов загрузки. */
    componentDidPreloaded() {}

    private renderWrapper = (): React.ReactNode => {
        if (this.state.error) {
            return <section>Произошла ошибка: {JSON.stringify(this.state.error)}</section>;
        }
        if (this.state.loading) {
            return <Loading message={this.preloadingMessage} type="section" />;
        }
        return this.renderOfSubClass();
    };
}
