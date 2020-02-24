import * as React from "react";
import AComponent from "./AComponent";
import Loading from "../cmp/Loading";
import {RouteComponentProps} from "react-router";
import IComponentState from "./IComponentState";

type State = {} & IComponentState;

/** Контроллер страницы. Определяет необхожимость показать стадию загрузки, служебные компоненты и непосредственно страницу. */
export default class PageWrapper extends AComponent<RouteComponentProps & {pageClass: React.ComponentClass<RouteComponentProps>} & any, State> {
    componentDidMount() {
        super.componentDidMount();
        this.setState({loading: true});
    }

    renderPage() {
        if (this.state.error) {
            return <>ERROR: {JSON.stringify(this.state.error)}</>;
        }
        if (this.state.loading) {
            return <Loading message="Подождите, идёт проверка пользователя..." type="section"/>;
        }
        const {pageClass, ...childProps} = this.props;
        return React.createElement(pageClass, {...childProps});
    }

    render() {
        return <div className={window.className("page-wrapper", {[`p-${this.props.pageClass.name}`]: !this.state.loading && !this.state.error})}>{this.renderPage()}</div>;
    }
}
