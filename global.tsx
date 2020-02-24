import * as _ from "underscore";

declare global {
    interface Window {
        className(...classes: Array<string | object | undefined | null>): string;

        idGenerator: IterableIterator<number>;
    }

    interface String {
        contains(sub: string, ignoreCase?: boolean): boolean;
    }

    interface ArrayConstructor {
        /** Возвращает элементы, которые не встречаются хотя бы в одном из массивов. */
        difference<T>(first: Array<T>, second: Array<T>): Array<T>;

        /** Возвращает элементы, которые есть в обоих массивах. */
        intersection<T>(first: Array<T>, second: Array<T>): Array<T>;
    }

    interface Array<T> {
        /** Возвращает массив значений, отсутствующих в другом массиве. */
        minus(another: Array<T>): Array<T>;

        /** Возвращает элементы, которые не встречаются хотя бы в одном из массивов. */
        difference<T>(second: Array<T>): Array<T>;

        /** Возвращает элементы, которые есть в обоих массивах. */
        intersection<T>(second: Array<T>): Array<T>;

        /** Возвращает элементы, которые есть в обоих массивах. */
        intersectionEx<T>(second: Array<T>, predicate: (element: T) => boolean): Array<T>;

        /** Содержится ли указанный элемент в массиве? */
        contains(element: T): boolean;

        /** Содержится ли элемент, удовлетворяющий предикату? */
        containsEx(predicate: (element: T) => boolean): boolean;
    }
}

String.prototype.contains = function(sub: string, ignoreCase?: boolean) {
    return ignoreCase ? this.toLocaleLowerCase().indexOf(sub.toLocaleLowerCase()) != -1 : this.indexOf(sub) != -1;
};

/** Создание строки классов CSS из объекта, форматируя в чистый вид.
 * @public
 * @return {String} */
window.className = (...classes) =>
    _.chain(classes)
        .flatten()
        .compact()
        .map(cls => (typeof cls !== "object" ? cls : _.map(cls, (e, key) => (e ? key : null))))
        .flatten()
        .compact()
        .value()
        .join(" ");
window.idGenerator = (function* () {
    let a = 1000;
    while (true) {
        yield a++;
    }
})();

// #################################################################################################### ARRAY STATIC
Array.difference = function <T>(first: Array<T>, second: Array<T>): Array<T> {
    const collector: Array<T> = [];
    first.forEach(v => {
        if (second.indexOf(v) == -1) {
            collector.push(v);
        }
    });
    second.forEach(v => {
        if (first.indexOf(v) == -1) {
            collector.push(v);
        }
    });
    return collector;
};
Array.intersection = function <T>(first: Array<T>, second: Array<T>): Array<T> {
    return first.filter(f => second.contains(f));
};

// #################################################################################################### ARRAY
Array.prototype.minus = function <T>(another: Array<T>): Array<T> {
    return this.filter(v => another.indexOf(v) == -1);
};
Array.prototype.difference = function <T>(second: Array<T>): Array<T> {
    return Array.difference(this, second);
};
Array.prototype.intersection = function <T>(second: Array<T>): Array<T> {
    return Array.intersection(this, second);
};
Array.prototype.intersectionEx = function <T>(second: Array<T>, predicate: (element: T) => boolean): Array<T> {
    return this.filter(t => second.containsEx(e => predicate(e) == predicate(t)));
};
Array.prototype.contains = function(element) {
    return this.indexOf(element) != -1;
};
Array.prototype.containsEx = function <T>(predicate: (element: T) => boolean) {
    return this.find(predicate) != null;
};
