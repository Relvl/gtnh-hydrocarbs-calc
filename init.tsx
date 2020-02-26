import * as ReactDOM from "react-dom";
import * as React from "react";
import {Application} from "./Application";
import {HashRouter} from "react-router-dom";

// region Костыли для Хрома. Ребята запретили дропать wheel эвенты... Разрешаем.
const EVENTS_TO_MODIFY = ["touchstart", "touchmove", "touchend", "touchcancel", "wheel"];
const originalAddEventListener = document.addEventListener;
const originalRemoveEventListener = document.removeEventListener;

window.document.addEventListener = (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
    let modOptions = options;
    if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === "boolean") {
            modOptions = {
                capture: options,
                passive: false,
            };
        } else if (typeof options === "object") {
            modOptions = {
                passive: false,
                ...options,
            };
        }
    }

    return originalAddEventListener(type, listener, modOptions);
};
window.document.removeEventListener = (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => {
    let modOptions = options;
    if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === "boolean") {
            modOptions = {
                capture: options,
                passive: false,
            };
        } else if (typeof options === "object") {
            modOptions = {
                // @ts-ignore
                passive: false,
                ...options,
            };
        }
    }
    return originalRemoveEventListener(type, listener, modOptions);
};
// endregion

ReactDOM.render(
    <HashRouter hashType="noslash">
        <Application/>
    </HashRouter>,
    document.getElementById("root"),
);