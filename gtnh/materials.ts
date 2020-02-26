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

    valueOf() {
        return this.id;
    }
}

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
}

export const Materials = {
    STEAM: new Material("STEAM", "Steam", 0),
    HYDROGEN: new Material("HYDROGEN", "Hydrogen", 0),
    HYDROGEN_SULFIDE: new Material("HYDROGEN_SULFIDE", "Hydrogen sulfide", 0),
    CARBON_T_P: new Material("CARBON_T_P", "Tiny pile of Carbon Dust", 0),

    BC_OIL: new Material("BC_OIL", "BuildCraft oil", 1),
    HEAVY_OIL: new Material("HEAVY_OIL", "Heavy oil", 1),

    SULFURIC_GAS: new Material("SULFURIC_GAS", "Sulfuric gas", 2),
    SULFURIC_LIGHT_FUEL: new Material("SULFURIC_LIGHT_FUEL", "Sulfuric light fuel", 2),
    SULFURIC_NAPHTA: new Material("SULFURIC_NAPHTA", "Sulfuric naphta", 2),
    SULFURIC_HEAVY_FUEL: new Material("SULFURIC_HEAVY_FUEL", "Sulfuric heavy fuel", 2),

    REFINERY_GAS: new Material("REFINERY_GAS", "Refinery gas", 3),
    NAPHTA: new Material("NAPHTA", "Naphta", 3),
    LIGHT_FUEL: new Material("LIGHT_FUEL", "Light fuel", 3),
    HEAVY_FUEL: new Material("HEAVY_FUEL", "Heavy fuel", 3),

    // naphta cracking
    NAPHTA_H_MOD: new Material("NAPHTA_H_MOD", "Moderately hydro-cracked naphta", 4),
    NAPHTA_H_LIG: new Material("NAPHTA_H_LIG", "Lightly hydro-cracked naphta", 4),
    NAPHTA_H_SEV: new Material("NAPHTA_H_SEV", "Severely hydro-cracked naphta", 4),
    NAPHTA_S_LIG: new Material("NAPHTA_S_LIG", "Lightly steam-cracked naphta", 4),
    NAPHTA_S_MOD: new Material("NAPHTA_S_MOD", "Moderately steam-cracked naphta", 4),
    NAPHTA_S_SEV: new Material("NAPHTA_S_SEV", "Severely steam-cracked naphta", 4),
    // light fuel cracking
    LIGHT_FUEL_H_MOD: new Material("LIGHT_FUEL_H_MOD", "Moderately hydro-cracked light fuel", 4),
    LIGHT_FUEL_H_LIG: new Material("LIGHT_FUEL_H_LIG", "Lightly hydro-cracked light fuel", 4),
    LIGHT_FUEL_H_SEV: new Material("LIGHT_FUEL_H_SEV", "Severely hydro-cracked light fuel", 4),
    LIGHT_FUEL_S_LIG: new Material("LIGHT_FUEL_S_LIG", "Lightly steam-cracked light fuel", 4),
    LIGHT_FUEL_S_MOD: new Material("LIGHT_FUEL_S_MOD", "Moderately steam-cracked light fuel", 4),
    LIGHT_FUEL_S_SEV: new Material("LIGHT_FUEL_S_SEV", "Severely steam-cracked light fuel", 4),
    // heavy fuel cracking
    HEAVY_FUEL_H_MOD: new Material("HEAVY_FUEL_H_MOD", "Moderately hydro-cracked heavy fuel", 4),
    HEAVY_FUEL_H_LIG: new Material("HEAVY_FUEL_H_LIG", "Lightly hydro-cracked heavy fuel", 4),
    HEAVY_FUEL_H_SEV: new Material("HEAVY_FUEL_H_SEV", "Severely hydro-cracked heavy fuel", 4),
    HEAVY_FUEL_S_LIG: new Material("HEAVY_FUEL_S_LIG", "Lightly steam-cracked heavy fuel", 4),
    HEAVY_FUEL_S_MOD: new Material("HEAVY_FUEL_S_MOD", "Moderately steam-cracked heavy fuel", 4),
    HEAVY_FUEL_S_SEV: new Material("HEAVY_FUEL_S_SEV", "Severely steam-cracked heavy fuel", 4),

    METHANE_GAS: new Material("METHANE_GAS", "Methane gas", 5),
    ETHANE: new Material("ETHANE", "Ethane", 5),
    HELIUM_GAS: new Material("HELIUM_GAS", "Helium gas", 5),
    BUTANE: new Material("BUTANE", "Buthane", 5),
    PROPANE: new Material("PROPANE", "Propane", 5),
    TOLUENE: new Material("TOLUENE", "Toluene", 5),
    BENZENE: new Material("BENZENE", "Benzene", 5),
    PHENOL: new Material("PHENOL", "Phenol", 5),
    BUTADIENE: new Material("BUTADIENE", "Butadiene", 5),
    BUTENE: new Material("BUTENE", "Butene", 5),
    PROPENE: new Material("PROPENE", "Propene", 5),
    ETHYLENE: new Material("ETHYLENE", "Ethylene", 5),
    OCTANE: new Material("OCTANE", "Octane", 5),

};

export enum Processes {
    BREWING,
    DISTILLATING,
    CHEMISTRY,
}

export const Recipes = [
    // oil distillating
    new Recipe([new MaterialVolume(Materials.BC_OIL, 25)], [new MaterialVolume(Materials.SULFURIC_GAS, 30)], 24, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.BC_OIL, 25)], [new MaterialVolume(Materials.SULFURIC_LIGHT_FUEL, 25)], 24, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.BC_OIL, 25)], [new MaterialVolume(Materials.SULFURIC_NAPHTA, 10)], 24, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.BC_OIL, 50)], [new MaterialVolume(Materials.SULFURIC_HEAVY_FUEL, 15)], 24, Processes.DISTILLATING),

    new Recipe([new MaterialVolume(Materials.HEAVY_OIL, 50)], [new MaterialVolume(Materials.SULFURIC_GAS, 30)], 24, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_OIL, 50)], [new MaterialVolume(Materials.SULFURIC_HEAVY_FUEL, 125)], 24, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_OIL, 100)], [new MaterialVolume(Materials.SULFURIC_LIGHT_FUEL, 45)], 24, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_OIL, 100)], [new MaterialVolume(Materials.SULFURIC_NAPHTA, 15)], 24, Processes.DISTILLATING),

    new Recipe([new MaterialVolume(Materials.SULFURIC_GAS, 16000), new MaterialVolume(Materials.HYDROGEN, 2000)], [new MaterialVolume(Materials.REFINERY_GAS, 16000), new MaterialVolume(Materials.HYDROGEN_SULFIDE, 1000)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.SULFURIC_NAPHTA, 12000), new MaterialVolume(Materials.HYDROGEN, 2000)], [new MaterialVolume(Materials.NAPHTA, 12000), new MaterialVolume(Materials.HYDROGEN_SULFIDE, 1000)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.SULFURIC_LIGHT_FUEL, 12000), new MaterialVolume(Materials.HYDROGEN, 2000)], [new MaterialVolume(Materials.LIGHT_FUEL, 12000), new MaterialVolume(Materials.HYDROGEN_SULFIDE, 1000)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.SULFURIC_HEAVY_FUEL, 8000), new MaterialVolume(Materials.HYDROGEN, 2000)], [new MaterialVolume(Materials.HEAVY_FUEL, 8000), new MaterialVolume(Materials.HYDROGEN_SULFIDE, 1000)], 30, Processes.CHEMISTRY),

    // refinery gas distillating
    new Recipe([new MaterialVolume(Materials.REFINERY_GAS, 40)], [new MaterialVolume(Materials.METHANE_GAS, 30)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.REFINERY_GAS, 40)], [new MaterialVolume(Materials.ETHANE, 4)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.REFINERY_GAS, 50)], [new MaterialVolume(Materials.HELIUM_GAS, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.REFINERY_GAS, 50)], [new MaterialVolume(Materials.BUTANE, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.REFINERY_GAS, 100)], [new MaterialVolume(Materials.PROPANE, 7)], 30, Processes.DISTILLATING),

    // heavy fuel distillating
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL, 10)], [new MaterialVolume(Materials.TOLUENE, 4)], 24, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL, 10)], [new MaterialVolume(Materials.BENZENE, 4)], 24, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL, 20)], [new MaterialVolume(Materials.PHENOL, 5)], 24, Processes.DISTILLATING),

    // naphta cracking
    new Recipe([new MaterialVolume(Materials.NAPHTA, 250), new MaterialVolume(Materials.HYDROGEN, 1000)], [new MaterialVolume(Materials.NAPHTA_H_MOD, 200)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.NAPHTA, 500), new MaterialVolume(Materials.HYDROGEN, 1000)], [new MaterialVolume(Materials.NAPHTA_H_LIG, 400)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.NAPHTA, 500), new MaterialVolume(Materials.HYDROGEN, 3000)], [new MaterialVolume(Materials.NAPHTA_H_SEV, 400)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.NAPHTA, 1000), new MaterialVolume(Materials.STEAM, 1000)], [new MaterialVolume(Materials.NAPHTA_S_LIG, 800)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.NAPHTA, 1000), new MaterialVolume(Materials.STEAM, 1000)], [new MaterialVolume(Materials.NAPHTA_S_MOD, 800)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.NAPHTA, 1000), new MaterialVolume(Materials.STEAM, 1000)], [new MaterialVolume(Materials.NAPHTA_S_SEV, 800)], 30, Processes.CHEMISTRY),
    // light fuel cracking
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL, 250), new MaterialVolume(Materials.HYDROGEN, 1000)], [new MaterialVolume(Materials.LIGHT_FUEL_H_MOD, 200)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL, 500), new MaterialVolume(Materials.HYDROGEN, 1000)], [new MaterialVolume(Materials.LIGHT_FUEL_H_LIG, 400)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL, 500), new MaterialVolume(Materials.HYDROGEN, 3000)], [new MaterialVolume(Materials.LIGHT_FUEL_H_SEV, 400)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL, 1000), new MaterialVolume(Materials.STEAM, 1000)], [new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 800)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL, 1000), new MaterialVolume(Materials.STEAM, 1000)], [new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 800)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL, 1000), new MaterialVolume(Materials.STEAM, 1000)], [new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 800)], 30, Processes.CHEMISTRY),
    // heavy fuel cracking
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL, 250), new MaterialVolume(Materials.HYDROGEN, 1000)], [new MaterialVolume(Materials.HEAVY_FUEL_H_MOD, 200)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL, 500), new MaterialVolume(Materials.HYDROGEN, 1000)], [new MaterialVolume(Materials.HEAVY_FUEL_H_LIG, 400)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL, 500), new MaterialVolume(Materials.HYDROGEN, 3000)], [new MaterialVolume(Materials.HEAVY_FUEL_H_SEV, 400)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL, 1000), new MaterialVolume(Materials.STEAM, 1000)], [new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 800)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL, 1000), new MaterialVolume(Materials.STEAM, 1000)], [new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 800)], 30, Processes.CHEMISTRY),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL, 1000), new MaterialVolume(Materials.STEAM, 1000)], [new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 800)], 30, Processes.CHEMISTRY),

    // cracked heavy fuel distillating - h mod
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.ETHANE, 10)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.METHANE_GAS, 10)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.LIGHT_FUEL, 40)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.NAPHTA, 40)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.PROPANE, 15)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.BUTANE, 15)], 30, Processes.DISTILLATING),
    // cracked heavy fuel distillating - h lig
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_LIG, 100)], [new MaterialVolume(Materials.PROPANE, 10)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_LIG, 100)], [new MaterialVolume(Materials.NAPHTA, 10)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_LIG, 100)], [new MaterialVolume(Materials.LIGHT_FUEL, 60)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_LIG, 100)], [new MaterialVolume(Materials.BUTANE, 10)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_LIG, 200)], [new MaterialVolume(Materials.ETHANE, 15)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_LIG, 200)], [new MaterialVolume(Materials.METHANE_GAS, 15)], 30, Processes.DISTILLATING),
    // cracked heavy fuel distillating - h sev
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_SEV, 100)], [new MaterialVolume(Materials.NAPHTA, 25)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_SEV, 100)], [new MaterialVolume(Materials.BUTANE, 30)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_SEV, 100)], [new MaterialVolume(Materials.PROPANE, 30)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_SEV, 100)], [new MaterialVolume(Materials.LIGHT_FUEL, 20)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_SEV, 200)], [new MaterialVolume(Materials.METHANE_GAS, 35)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_H_SEV, 200)], [new MaterialVolume(Materials.ETHANE, 35)], 30, Processes.DISTILLATING),
    // cracked heavy fuel distillating - s lig
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.LIGHT_FUEL, 300), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.BUTADIENE, 15), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.ETHANE, 5), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.BUTENE, 25), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.PROPENE, 30), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.BENZENE, 125), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.PROPANE, 3), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.TOLUENE, 25), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.METHANE_GAS, 50), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.ETHYLENE, 50), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.NAPHTA, 50), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    // cracked heavy fuel distillating - s mod
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.BUTENE, 20), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.TOLUENE, 20), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.BENZENE, 100), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.LIGHT_FUEL, 100), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.NAPHTA, 100), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.PROPENE, 25), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 1000)], [new MaterialVolume(Materials.ETHYLENE, 75), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 1000)], [new MaterialVolume(Materials.METHANE_GAS, 75), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 1000)], [new MaterialVolume(Materials.ETHANE, 7), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 1000)], [new MaterialVolume(Materials.PROPANE, 5), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_MOD, 1000)], [new MaterialVolume(Materials.BUTADIENE, 25), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    // cracked heavy fuel distillating - s sev
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.ETHYLENE, 150), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.BENZENE, 400), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.BUTENE, 80), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.NAPHTA, 125), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.BUTADIENE, 50), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.PROPENE, 100), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.LIGHT_FUEL, 100), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.METHANE_GAS, 150), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.PROPANE, 10), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.ETHANE, 15), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.HEAVY_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.TOLUENE, 80), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),

    // cracked light fuel distillating - h mod
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.BUTANE, 20)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.OCTANE, 5)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.PROPANE, 110)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.NAPHTA, 50)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.METHANE_GAS, 40)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_MOD, 100)], [new MaterialVolume(Materials.ETHANE, 40)], 30, Processes.DISTILLATING),
    // cracked light fuel distillating - h lig
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_LIG, 100)], [new MaterialVolume(Materials.OCTANE, 10)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_LIG, 100)], [new MaterialVolume(Materials.NAPHTA, 80)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_LIG, 100)], [new MaterialVolume(Materials.PROPANE, 20)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_LIG, 100)], [new MaterialVolume(Materials.BUTANE, 15)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_LIG, 200)], [new MaterialVolume(Materials.METHANE_GAS, 25)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_LIG, 200)], [new MaterialVolume(Materials.ETHANE, 25)], 30, Processes.DISTILLATING),
    // cracked light fuel distillating - h sev
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_SEV, 100)], [new MaterialVolume(Materials.NAPHTA, 20)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_SEV, 100)], [new MaterialVolume(Materials.OCTANE, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_SEV, 100)], [new MaterialVolume(Materials.ETHANE, 150)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_SEV, 100)], [new MaterialVolume(Materials.METHANE_GAS, 150)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_SEV, 200)], [new MaterialVolume(Materials.BUTANE, 25)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_H_SEV, 200)], [new MaterialVolume(Materials.PROPANE, 25)], 30, Processes.DISTILLATING),
    // cracked light fuel distillating - s lig
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.TOLUENE, 40), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.ETHYLENE, 50), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.METHANE_GAS, 50), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.ETHANE, 10), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.PROPANE, 20), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.BUTENE, 75), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.PROPENE, 150), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.BUTADIENE, 60), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.BENZENE, 200), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.NAPHTA, 400), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_LIG, 1000)], [new MaterialVolume(Materials.HEAVY_FUEL, 150), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    // cracked light fuel distillating - s mod
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.HEAVY_FUEL, 50), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.BUTENE, 45), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.METHANE_GAS, 75), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.ETHANE, 15), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.TOLUENE, 25), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 500)], [new MaterialVolume(Materials.PROPENE, 100), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 1000)], [new MaterialVolume(Materials.ETHYLENE, 75), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 1000)], [new MaterialVolume(Materials.BENZENE, 150), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 1000)], [new MaterialVolume(Materials.NAPHTA, 125), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 1000)], [new MaterialVolume(Materials.BUTADIENE, 75), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_MOD, 1000)], [new MaterialVolume(Materials.PROPANE, 35), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    // cracked light fuel distillating - s sev
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.BUTENE, 65), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.NAPHTA, 100), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.PROPANE, 50), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.METHANE_GAS, 250), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.HEAVY_FUEL, 50), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.BUTADIENE, 50), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.ETHANE, 50), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.BENZENE, 150), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.ETHYLENE, 250), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.TOLUENE, 30), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.LIGHT_FUEL_S_SEV, 1000)], [new MaterialVolume(Materials.PROPENE, 250), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),

    // cracked naphta distillating - h mod
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_MOD, 100)], [new MaterialVolume(Materials.ETHANE, 40)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_MOD, 100)], [new MaterialVolume(Materials.METHANE_GAS, 40)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_MOD, 100)], [new MaterialVolume(Materials.PROPANE, 110)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_MOD, 100)], [new MaterialVolume(Materials.BUTANE, 20)], 30, Processes.DISTILLATING),
    // cracked light fuel distillating - h lig
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_LIG, 100)], [new MaterialVolume(Materials.ETHANE, 25)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_LIG, 100)], [new MaterialVolume(Materials.BUTANE, 80)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_LIG, 100)], [new MaterialVolume(Materials.PROPANE, 30)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_LIG, 100)], [new MaterialVolume(Materials.METHANE_GAS, 25)], 30, Processes.DISTILLATING),
    // cracked light fuel distillating - h sev
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_SEV, 100)], [new MaterialVolume(Materials.ETHANE, 150)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_SEV, 100)], [new MaterialVolume(Materials.METHANE_GAS, 150)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_SEV, 200)], [new MaterialVolume(Materials.PROPANE, 25)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_H_SEV, 200)], [new MaterialVolume(Materials.BUTANE, 25)], 30, Processes.DISTILLATING),
    // cracked naphta distillating - s lig
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_LIG, 1000)], [new MaterialVolume(Materials.BENZENE, 150), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_LIG, 1000)], [new MaterialVolume(Materials.TOLUENE, 40), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_LIG, 1000)], [new MaterialVolume(Materials.BUTADIENE, 150), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_LIG, 1000)], [new MaterialVolume(Materials.ETHANE, 35), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_LIG, 1000)], [new MaterialVolume(Materials.HEAVY_FUEL, 75), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_LIG, 1000)], [new MaterialVolume(Materials.PROPANE, 15), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_LIG, 1000)], [new MaterialVolume(Materials.LIGHT_FUEL, 150), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_LIG, 1000)], [new MaterialVolume(Materials.PROPENE, 200), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_LIG, 1000)], [new MaterialVolume(Materials.BUTENE, 80), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_LIG, 1000)], [new MaterialVolume(Materials.METHANE_GAS, 200), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_LIG, 1000)], [new MaterialVolume(Materials.ETHYLENE, 200), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    // cracked naphta distillating - s mod
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_MOD, 500)], [new MaterialVolume(Materials.PROPENE, 200), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_MOD, 500)], [new MaterialVolume(Materials.LIGHT_FUEL, 50), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_MOD, 500)], [new MaterialVolume(Materials.METHANE_GAS, 175), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_MOD, 500)], [new MaterialVolume(Materials.HEAVY_FUEL, 25), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_MOD, 500)], [new MaterialVolume(Materials.ETHANE, 25), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_MOD, 500)], [new MaterialVolume(Materials.TOLUENE, 15), new MaterialVolume(Materials.CARBON_T_P, 1)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_MOD, 1000)], [new MaterialVolume(Materials.PROPANE, 15), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_MOD, 1000)], [new MaterialVolume(Materials.BUTADIENE, 50), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_MOD, 1000)], [new MaterialVolume(Materials.ETHYLENE, 175), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_MOD, 1000)], [new MaterialVolume(Materials.BENZENE, 125), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_MOD, 1000)], [new MaterialVolume(Materials.BUTENE, 65), new MaterialVolume(Materials.CARBON_T_P, 2)], 30, Processes.DISTILLATING),
    // cracked naphta distillating - s sev
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_SEV, 1000)], [new MaterialVolume(Materials.ETHYLENE, 500), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_SEV, 1000)], [new MaterialVolume(Materials.PROPANE, 15), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_SEV, 1000)], [new MaterialVolume(Materials.TOLUENE, 20), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_SEV, 1000)], [new MaterialVolume(Materials.BUTENE, 50), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_SEV, 1000)], [new MaterialVolume(Materials.BENZENE, 100), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_SEV, 1000)], [new MaterialVolume(Materials.LIGHT_FUEL, 50), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_SEV, 1000)], [new MaterialVolume(Materials.BUTADIENE, 50), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_SEV, 1000)], [new MaterialVolume(Materials.ETHANE, 65), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_SEV, 1000)], [new MaterialVolume(Materials.METHANE_GAS, 500), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_SEV, 1000)], [new MaterialVolume(Materials.PROPENE, 300), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),
    new Recipe([new MaterialVolume(Materials.NAPHTA_S_SEV, 1000)], [new MaterialVolume(Materials.HEAVY_FUEL, 25), new MaterialVolume(Materials.CARBON_T_P, 3)], 30, Processes.DISTILLATING),

];

