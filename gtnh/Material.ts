export class Material {
    readonly id: string;
    readonly name: string;
    readonly tier: number;
    readonly solid: boolean;

    constructor(id: string, name: string, tier: number, solid: boolean = false) {
        this.id = id;
        this.name = name;
        this.tier = tier;
        this.solid = solid;
    }

    toString() {
        return this.name;
    }
}

