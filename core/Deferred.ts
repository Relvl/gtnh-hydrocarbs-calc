export default class Deferred<T = never> implements Promise<T> {
    private resolveFunc: (value: T) => void;
    private rejectFunc: (reason: any) => void;
    private promise: Promise<T>;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolveFunc = resolve;
            this.rejectFunc = reject;
        });
    }

    public then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2> {
        return this.promise.then(onfulfilled, onrejected);
    }

    public catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
        return this.promise.then(onrejected);
    }

    public finally(onfinally?: () => void): Promise<T> {
        return this.promise.finally(onfinally);
    }

    public resolve(value?: T) {
        this.resolveFunc(value);
    }

    public reject(reason: any) {
        this.rejectFunc(reason);
    }

    [Symbol.toStringTag]: "Promise";
}