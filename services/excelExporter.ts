import * as XLSX from "xlsx";
import { CalculationResult, Plot } from "../types";

export const exportToExcel = (results: CalculationResult, plot: Plot) => {
  // 1. Create Summary Worksheet
  const summaryData = [
    ["Informasi Plot & Ringkasan Kalkulasi"],
    [],
    ["Nama Plot", plot.name || "N/A"],
    ["Luas Plot (hektar)", plot.area],
    [],
    ["Metrik", "Nilai", "Unit"],
    ["Total Pohon", results.totalTrees, "pohon"],
    ["Total Stok Karbon", results.totalCarbonStockTonnes.toFixed(4), "ton C"],
    ["Total Serapan CO₂", results.totalCO2SequestrationTonnes.toFixed(4), "ton CO₂e"],
    ["Stok Karbon per Hektar", results.carbonStockPerHectare.toFixed(4), "ton C/ha"],
    ["Serapan CO₂ per Hektar", results.co2SequestrationPerHectare.toFixed(4), "ton CO₂e/ha"],
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);

  // 2. Create Tree Details Worksheet
  const treeDetailsHeader = ["ID Pohon", "Jenis Pohon", "DBH (cm)", "Stok Karbon (kg)", "Serapan CO₂ (kg)"];
  const treeDetailsData = results.treeBreakdown.map((tree) => [tree.id, tree.speciesName, tree.dbh, tree.carbonStockKg.toFixed(4), tree.co2SequestrationKg.toFixed(4)]);
  const treeDetailsWs = XLSX.utils.aoa_to_sheet([treeDetailsHeader, ...treeDetailsData]);

  // Auto-fit columns for both sheets
  const fitCols = (ws: XLSX.WorkSheet) => {
    if (!ws["!data"]) return;
    const objectMaxLength: { wch: number }[] = [];
    ws["!data"].forEach((row: XLSX.CellObject[]) => {
      Object.keys(row).forEach((key) => {
        const cell = row[Number(key)];
        const len = cell.v ? String(cell.v).length : 0;
        objectMaxLength[Number(key)] = objectMaxLength[Number(key)] || { wch: 0 };
        objectMaxLength[Number(key)].wch = objectMaxLength[Number(key)].wch < len ? len : objectMaxLength[Number(key)].wch;
      });
    });
    ws["!cols"] = objectMaxLength;
  };
  fitCols(summaryWs);
  fitCols(treeDetailsWs);

  // 3. Create Workbook and Download
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, summaryWs, "Ringkasan");
  XLSX.utils.book_append_sheet(wb, treeDetailsWs, "Rincian Pohon");

  const fileName = `Kalkulasi_Karbon_${(plot.name || "Plot").replace(/ /g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
