import {Processes} from "./Processes";
import {Material} from "./Material";
import {MaterialVolume} from "./MaterialVolume";

export class Recipe {
    readonly sources: Array<MaterialVolume>;
    readonly targets: Array<MaterialVolume>;
    readonly power: number;
    readonly process: Processes;

    constructor(s: Array<MaterialVolume>, t: Array<MaterialVolume>, power: number, process: Processes) {
        this.sources = s;
        this.targets = t;
        this.power = power;
        this.process = process;
    }

    hasResult(target: Material) {
        return this.targets.containsEx(r => r.material == target);
    }

    hasSource(source: Material) {
        return this.sources.containsEx(r => r.material == source);
    }

    getRatio(source: Material, target: Material): number {
        const sourceVol = this.sources.find(r => r.material == source).volume;
        const targetVol = this.targets.find(r => r.material == target).volume;
        return targetVol / sourceVol;
    }

    toString() {
        return `R[${this.sources.map(s => `${s.material.name}(${s.volume})`).join(",")}]=>[${this.targets.map(s => `${s.material.name}(${s.volume})`).join(",")}]`;
    }

    toStringSimple() {
        return `${this.sources.filter(s => s.material.tier > 0).map(s => s.material.name)} -> ${this.targets.filter(s => s.material.tier > 0).map(s => s.material.name)}`;
    }
}