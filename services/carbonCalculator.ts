
import { Tree, CalculationResult, TreeCalculation } from '../types';

/**
 * Calculates carbon stock and sequestration for a list of trees within a plot.
 * Formulas are based on general allometric equations and IPCC guidelines.
 *
 * @param trees - Array of Tree objects to be included in the calculation.
 * @param plotArea - The total area of the plot in hectares.
 * @returns A CalculationResult object with detailed and summary data.
 */
export const calculateCarbon = (trees: Tree[], plotArea: number): CalculationResult => {
  if (trees.length === 0) {
    return {
      totalTrees: 0,
      totalCarbonStockTonnes: 0,
      totalCO2SequestrationTonnes: 0,
      carbonStockPerHectare: 0,
      co2SequestrationPerHectare: 0,
      treeBreakdown: [],
    };
  }

  let totalCarbonStockKg = 0;
  const treeBreakdown: TreeCalculation[] = [];

  trees.forEach(tree => {
    // General allometric equation for tropical trees: AGB = 0.0673 * (ρ * D^2 * H)^0.976
    // To simplify (as we don't have height H), we use a common simplified equation:
    // AGB (kg) = exp(-1.803 + 0.976 * ln(ρ) + 2.673 * ln(D) - 0.0299 * (ln(D))^2)
    // where ρ is wood density (g/cm^3) and D is DBH (cm).
    const rho = tree.species.woodDensity;
    const dbh = tree.dbh;
    
    // A simpler formula for broader applicability without height: AGB = 0.11 * ρ * DBH^2.62
    // Let's use this one for simplicity.
    const aboveGroundBiomassKg = 0.11 * rho * Math.pow(dbh, 2.62);
    
    // Below Ground Biomass is estimated as 26% of AGB for tropical forests (IPCC default).
    const belowGroundBiomassKg = aboveGroundBiomassKg * 0.26;
    
    const totalBiomassKg = aboveGroundBiomassKg + belowGroundBiomassKg;
    
    // Carbon content is approx 47% of total biomass (IPCC default).
    const carbonStockKg = totalBiomassKg * 0.47;
    
    // To get CO2 equivalent, multiply by the molecular weight ratio of CO2 to C (44/12).
    const co2SequestrationKg = carbonStockKg * (44 / 12);

    totalCarbonStockKg += carbonStockKg;
    treeBreakdown.push({
      id: tree.id,
      speciesName: tree.species.name,
      dbh: tree.dbh,
      carbonStockKg: carbonStockKg,
      co2SequestrationKg: co2SequestrationKg,
    });
  });
  
  const totalCarbonStockTonnes = totalCarbonStockKg / 1000;
  const totalCO2SequestrationTonnes = (totalCarbonStockKg * (44/12)) / 1000;
  
  const safePlotArea = plotArea > 0 ? plotArea : 1; // Avoid division by zero

  return {
    totalTrees: trees.length,
    totalCarbonStockTonnes: totalCarbonStockTonnes,
    totalCO2SequestrationTonnes: totalCO2SequestrationTonnes,
    carbonStockPerHectare: totalCarbonStockTonnes / safePlotArea,
    co2SequestrationPerHectare: totalCO2SequestrationTonnes / safePlotArea,
    treeBreakdown: treeBreakdown,
  };
};
