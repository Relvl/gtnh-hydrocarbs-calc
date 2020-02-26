export class Material {
    readonly id: string;
    readonly name: string;
    readonly tier: number;

    constructor(id: string, name: string, tier: number) {
        this.id = id;
        this.name = name;
        this.tier = tier;
    }

    toString() {
        return this.name;
    }
}

