
export interface SpeciesData {
  name: string;
  scientificName: string;
  woodDensity: number; // g/cm^3
}

export interface Tree {
  id: string;
  species: SpeciesData;
  dbh: number; // in cm
}

export interface Plot {
  name: string;
  area: number; // in hectares
}

export interface TreeCalculation {
  id: string;
  speciesName: string;
  dbh: number;
  carbonStockKg: number;
  co2SequestrationKg: number;
}

export interface CalculationResult {
  totalTrees: number;
  totalCarbonStockTonnes: number;
  totalCO2SequestrationTonnes: number;
  carbonStockPerHectare: number;
  co2SequestrationPerHectare: number;
  treeBreakdown: TreeCalculation[];
}
