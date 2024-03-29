import {Material} from "../Material";

export const Materials = {
    STEAM: new Material("STEAM", "Steam", 0),
    NITROGEN: new Material("NITROGEN", "Nitrogen", 0),
    HYDROGEN: new Material("HYDROGEN", "Hydrogen", 0),
    HYDROGEN_SULFIDE: new Material("HYDROGEN_SULFIDE", "Hydrogen Sulfide", 0),
    CARBON_T_P: new Material("CARBON_T_P", "Tiny pile of Carbon Dust", 0, true),
    CHARCOAL: new Material("CHARCOAL", "Charcoal", 0, true),
    ASHES: new Material("ASHES", "Ashes", 0, true),
    TALC: new Material("TALC", "Talc", 0, true),

    BC_OIL: new Material("BC_OIL", "BuildCraft Oil", 1),
    HEAVY_OIL: new Material("HEAVY_OIL", "Heavy Oil", 1),
    LIGHT_OIL: new Material("LIGHT_OIL", "Light Oil", 1),
    WOOD: new Material("WOOD", "Wood", 1, true),
    COAL: new Material("COAL", "Coal", 1, true),
    COAL_COKE: new Material("COAL_COKE", "Coal Coke", 1, true),

    SULFURIC_GAS: new Material("SULFURIC_GAS", "Sulfuric Gas", 2),
    SULFURIC_LIGHT_FUEL: new Material("SULFURIC_LIGHT_FUEL", "Sulfuric Light Fuel", 2),
    SULFURIC_NAPHTA: new Material("SULFURIC_NAPHTA", "Sulfuric Naphta", 2),
    SULFURIC_HEAVY_FUEL: new Material("SULFURIC_HEAVY_FUEL", "Sulfuric Heavy Fuel", 2),

    // Naphta cracking
    NAPHTA_H_MOD: new Material("NAPHTA_H_MOD", "Moderately hydro-cracked Naphta", 4),
    NAPHTA_H_LIG: new Material("NAPHTA_H_LIG", "Lightly hydro-cracked Naphta", 4),
    NAPHTA_H_SEV: new Material("NAPHTA_H_SEV", "Severely hydro-cracked Naphta", 4),
    NAPHTA_S_LIG: new Material("NAPHTA_S_LIG", "Lightly steam-cracked Naphta", 4),
    NAPHTA_S_MOD: new Material("NAPHTA_S_MOD", "Moderately steam-cracked Naphta", 4),
    NAPHTA_S_SEV: new Material("NAPHTA_S_SEV", "Severely steam-cracked Naphta", 4),
    // Light Fuel cracking
    LIGHT_FUEL_H_MOD: new Material("LIGHT_FUEL_H_MOD", "Moderately hydro-cracked Light Fuel", 4),
    LIGHT_FUEL_H_LIG: new Material("LIGHT_FUEL_H_LIG", "Lightly hydro-cracked Light Fuel", 4),
    LIGHT_FUEL_H_SEV: new Material("LIGHT_FUEL_H_SEV", "Severely hydro-cracked Light Fuel", 4),
    LIGHT_FUEL_S_LIG: new Material("LIGHT_FUEL_S_LIG", "Lightly steam-cracked Light Fuel", 4),
    LIGHT_FUEL_S_MOD: new Material("LIGHT_FUEL_S_MOD", "Moderately steam-cracked Light Fuel", 4),
    LIGHT_FUEL_S_SEV: new Material("LIGHT_FUEL_S_SEV", "Severely steam-cracked Light Fuel", 4),
    // Heavy Fuel cracking
    HEAVY_FUEL_H_MOD: new Material("HEAVY_FUEL_H_MOD", "Moderately hydro-cracked Heavy Fuel", 4),
    HEAVY_FUEL_H_LIG: new Material("HEAVY_FUEL_H_LIG", "Lightly hydro-cracked Heavy Fuel", 4),
    HEAVY_FUEL_H_SEV: new Material("HEAVY_FUEL_H_SEV", "Severely hydro-cracked Heavy Fuel", 4),
    HEAVY_FUEL_S_LIG: new Material("HEAVY_FUEL_S_LIG", "Lightly steam-cracked Heavy Fuel", 4),
    HEAVY_FUEL_S_MOD: new Material("HEAVY_FUEL_S_MOD", "Moderately steam-cracked Heavy Fuel", 4),
    HEAVY_FUEL_S_SEV: new Material("HEAVY_FUEL_S_SEV", "Severely steam-cracked Heavy Fuel", 4),

    REFINERY_GAS: new Material("REFINERY_GAS", "Refinery Gas", 5),
    NAPHTA: new Material("NAPHTA", "Naphta", 5),
    LIGHT_FUEL: new Material("LIGHT_FUEL", "Light Fuel", 5),
    HEAVY_FUEL: new Material("HEAVY_FUEL", "Heavy Fuel", 5),

    METHANE_GAS: new Material("METHANE_GAS", "Methane Gas", 6),
    ETHANE: new Material("ETHANE", "Ethane", 6),
    HELIUM_GAS: new Material("HELIUM_GAS", "Helium Gas", 6),
    BUTANE: new Material("BUTANE", "Buthane", 6),
    PROPANE: new Material("PROPANE", "Propane", 6),
    TOLUENE: new Material("TOLUENE", "Toluene", 6),
    BENZENE: new Material("BENZENE", "Benzene", 6),
    PHENOL: new Material("PHENOL", "Phenol", 6),
    BUTADIENE: new Material("BUTADIENE", "Butadiene", 6),
    BUTENE: new Material("BUTENE", "Butene", 6),
    PROPENE: new Material("PROPENE", "Propene", 6),
    ETHYLENE: new Material("ETHYLENE", "Ethylene", 6),
    OCTANE: new Material("OCTANE", "Octane", 6),

    // todo cracked t6 materials!

    COAL_GAS: new Material("COAL_GAS", "Coal Gas", 2),
    COAL_TAR: new Material("COAL_TAR", "Coal Tar", 2),
    WOOD_VINEGAR: new Material("WOOD_VINEGAR", "Wood vinegar", 2),
    WOOD_TAR: new Material("WOOD_TAR", "Wood Tar", 2),
    WOOD_GAS: new Material("WOOD_GAS", "Wood Gas", 2),
    CREOSOTE_OIL: new Material("CREOSOTE_OIL", "Creosote Oil", 2),
    CHARCOAL_BYPRODUCTS: new Material("CHARCOAL_BYPRODUCTS", "Charcoal Byproducts", 2),

    ETHANOL: new Material("ETHANOL", "Ethanol", 3),
    METHYL_ACETATE: new Material("METHYL_ACETATE", "Methyl Acetate", 3),
    ACETONE: new Material("ACETONE", "Acetone", 3),
    METHANOL: new Material("METHANOL", "Methanol", 3),
    ACETIC_ACID: new Material("ACETIC_ACID", "Acetic Acid", 3),

    DIMETYLBENZENE: new Material("DIMETYLBENZENE", "Dimethylbenzene", 3),
    CO2_GAS: new Material("CO2_GAS", "CO2 Gas", 3),
    CARBON_MONOXIDE: new Material("CARBON_MONOXIDE", "Carbon Monoxide", 99),
    LUBRICANT: new Material("LUBRICANT", "Lubricant", 99),
};
