import {Material} from "./Material";

export class MaterialVolume {
    readonly material: Material;
    readonly volume: number;

    constructor(material: Material, volume: number) {
        this.material = material;
        this.volume = volume;
    }

    toString() {
        return `${this.material.name}(${this.volume})`;
    }

    valueOf() {
        return this.material.id;
    }
}