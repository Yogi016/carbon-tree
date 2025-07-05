import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Plot, Tree, CalculationResult, SpeciesData } from './types';
import { TREE_SPECIES_DATA } from './constants';
import { calculateCarbon } from './services/carbonCalculator';
import { getTreeFacts } from './services/geminiService';
import { exportToExcel } from './services/excelExporter';
import { LeafIcon } from './components/icons/LeafIcon';
import { TrashIcon } from './components/icons/TrashIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';
import { Card } from './components/Card';


const PlotInput: React.FC<{ plot: Plot; onChange: (plot: Plot) => void }> = ({ plot, onChange }) => (
  <Card className="flex-1">
    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
      <span className="text-primary mr-2">1.</span> Informasi Plot
    </h2>
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label htmlFor="plotName" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Nama Plot</label>
        <input
          type="text"
          id="plotName"
          value={plot.name}
          onChange={(e) => onChange({ ...plot, name: e.target.value })}
          placeholder="e.g., Plot Hutan Kota"
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="plotArea" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Luas Plot (hektar)</label>
        <input
          type="number"
          id="plotArea"
          value={plot.area}
          min="0.01"
          step="0.01"
          onChange={(e) => onChange({ ...plot, area: parseFloat(e.target.value) || 0 })}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
    </div>
  </Card>
);

const TreeInputForm: React.FC<{ onAddTree: (species: SpeciesData, dbh: number) => void }> = ({ onAddTree }) => {
  const [speciesName, setSpeciesName] = useState(TREE_SPECIES_DATA[0].name);
  const [dbh, setDbh] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSpecies = TREE_SPECIES_DATA.find(s => s.name === speciesName);
    if (selectedSpecies && dbh) {
      onAddTree(selectedSpecies, parseFloat(dbh));
      setDbh('');
    }
  };

  return (
    <Card className="flex-1">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
         <span className="text-primary mr-2">2.</span> Tambah Pohon
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="md:col-span-2">
          <label htmlFor="species" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Jenis Pohon</label>
          <select
            id="species"
            value={speciesName}
            onChange={(e) => setSpeciesName(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            {TREE_SPECIES_DATA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="dbh" className="block text-sm font-medium text-slate-600 dark:text-slate-300">DBH (cm)</label>
          <input
            type="number"
            id="dbh"
            value={dbh}
            onChange={(e) => setDbh(e.target.value)}
            placeholder="e.g., 30"
            min="1"
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:ring-offset-slate-800 h-10">
            Tambah
          </button>
        </div>
      </form>
    </Card>
  );
};

const TreeList: React.FC<{ trees: Tree[]; onRemoveTree: (id: string) => void }> = ({ trees, onRemoveTree }) => (
  <Card>
     <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
        <span className="text-primary mr-2">3.</span> Daftar Pohon ({trees.length})
     </h2>
    <div className="max-h-72 overflow-y-auto pr-2 -mr-2 rounded-lg">
      {trees.length > 0 ? (
        <ul className="space-y-3">
          {trees.map((tree) => (
            <li key={tree.id} className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/80 p-3 rounded-lg shadow-sm">
              <div className="flex items-center truncate">
                <LeafIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0" />
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{tree.species.name} - <span className="text-slate-500 dark:text-slate-400">DBH: {tree.dbh} cm</span></p>
              </div>
              <button onClick={() => onRemoveTree(tree.id)} className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500 ml-2 flex-shrink-0">
                <TrashIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-slate-500 dark:text-slate-400 py-8">
            <LeafIcon className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600"/>
            <h3 className="mt-2 text-sm font-medium">Belum ada pohon</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Mulai dengan menambahkan pohon di atas.</p>
        </div>
      )}
    </div>
  </Card>
);

const ResultsDisplay: React.FC<{ 
  results: CalculationResult | null;
  plot: Plot;
  onGetFacts: (species: SpeciesData) => void;
  geminiFacts: { speciesName: string; text: string; } | null;
  isGeminiLoading: boolean;
  mostCommonSpecies: SpeciesData | null;
}> = ({ results, plot, onGetFacts, geminiFacts, isGeminiLoading, mostCommonSpecies }) => {
  if (!results) return null;

  const formatNumber = (num: number) => num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const StatCard = ({ title, value, unit, icon }: {title: string; value: string; unit: string; icon: React.ReactNode}) => (
    <div className="bg-white/70 dark:bg-slate-900/50 p-4 rounded-xl text-center shadow-inner">
      <div className="flex justify-center items-center text-primary dark:text-primary-400 mb-2">{icon}</div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{title}</p>
      <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{unit}</p>
    </div>
  );

  return (
    <Card className="mt-8 bg-gradient-to-br from-primary-50 to-emerald-100 dark:from-slate-800/50 dark:to-slate-900 border border-primary/20">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Hasil Estimasi Karbon</h2>
        <button
          onClick={() => exportToExcel(results, plot)}
          className="inline-flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:ring-offset-slate-900"
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export Excel
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Stok Karbon" value={formatNumber(results.totalCarbonStockTonnes)} unit="ton C" icon={<LeafIcon className="h-6 w-6"/>} />
        <StatCard title="Total Serapan CO₂" value={formatNumber(results.totalCO2SequestrationTonnes)} unit="ton CO₂e" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>} />
        <StatCard title="Stok Karbon/Hektar" value={plot.area > 0 ? formatNumber(results.carbonStockPerHectare) : 'N/A'} unit="ton C/ha" icon={<LeafIcon className="h-6 w-6"/>} />
        <StatCard title="Serapan CO₂/Hektar" value={plot.area > 0 ? formatNumber(results.co2SequestrationPerHectare) : 'N/A'} unit="ton CO₂e/ha" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>} />
      </div>
      
       <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Rincian Per Pohon</h3>
            <div className="overflow-x-auto max-h-80 relative rounded-lg border dark:border-slate-700">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300 sticky top-0">
                        <tr>
                            <th scope="col" className="py-3 px-6">Jenis Pohon</th>
                            <th scope="col" className="py-3 px-6">DBH (cm)</th>
                            <th scope="col" className="py-3 px-6 text-right">Stok Karbon (kg)</th>
                            <th scope="col" className="py-3 px-6 text-right">Serapan CO₂ (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.treeBreakdown.map((tree) => (
                            <tr key={tree.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                <th scope="row" className="py-4 px-6 font-medium text-slate-900 dark:text-white whitespace-nowrap">{tree.speciesName}</th>
                                <td className="py-4 px-6">{tree.dbh}</td>
                                <td className="py-4 px-6 text-right">{formatNumber(tree.carbonStockKg)}</td>
                                <td className="py-4 px-6 text-right">{formatNumber(tree.co2SequestrationKg)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      {mostCommonSpecies && (
        <div className="mt-8 text-center">
          <button
            onClick={() => onGetFacts(mostCommonSpecies)}
            disabled={isGeminiLoading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:ring-offset-slate-900 transform hover:scale-105 transition-transform"
          >
            {isGeminiLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memuat...
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5 mr-2" />
                Fakta Menarik tentang {mostCommonSpecies.name}
              </>
            )}
          </button>
        </div>
      )}
      
      {geminiFacts && geminiFacts.speciesName === mostCommonSpecies?.name && (
        <div className="mt-6 p-5 bg-indigo-50 dark:bg-slate-900/50 rounded-lg border border-indigo-200 dark:border-slate-700">
          <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-200 mb-2 flex items-center"><SparklesIcon className="h-5 w-5 mr-2 text-indigo-500"/> Tentang {geminiFacts.speciesName}</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{geminiFacts.text}</p>
        </div>
      )}
    </Card>
  );
};


export default function App() {
  const [plot, setPlot] = useState<Plot>({ name: '', area: 1 });
  const [trees, setTrees] = useState<Tree[]>([]);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [geminiFacts, setGeminiFacts] = useState<{ speciesName: string; text: string; } | null>(null);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                   (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleAddTree = useCallback((species: SpeciesData, dbh: number) => {
    const newTree: Tree = { id: crypto.randomUUID(), species, dbh };
    setTrees(prevTrees => [...prevTrees, newTree]);
    setResults(null); // Reset results when tree list changes
    setGeminiFacts(null);
  }, []);

  const handleRemoveTree = useCallback((id: string) => {
    setTrees(prevTrees => prevTrees.filter(tree => tree.id !== id));
    setResults(null);
    setGeminiFacts(null);
  }, []);

  const handleCalculate = useCallback(() => {
    if (trees.length > 0) {
      const calculationResults = calculateCarbon(trees, plot.area);
      setResults(calculationResults);
      setTimeout(() => {
        document.getElementById('results-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [trees, plot.area]);

  const mostCommonSpecies = useMemo((): SpeciesData | null => {
    if (trees.length === 0) return null;
    const speciesCount = trees.reduce((acc, tree) => {
      acc[tree.species.name] = (acc[tree.species.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonName = Object.keys(speciesCount).reduce((a, b) => speciesCount[a] > speciesCount[b] ? a : b);
    return TREE_SPECIES_DATA.find(s => s.name === mostCommonName) ?? null;
  }, [trees]);

  const handleGetFacts = useCallback(async (species: SpeciesData) => {
    setIsGeminiLoading(true);
    setGeminiFacts(null);
    try {
      const facts = await getTreeFacts(species.name, species.scientificName);
      setGeminiFacts({ speciesName: species.name, text: facts });
    } catch (error) {
      console.error(error);
      setGeminiFacts({ speciesName: species.name, text: 'Gagal memuat fakta.' });
    } finally {
      setIsGeminiLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-900/80 shadow-sm sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <LeafIcon className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="ml-3 text-2xl font-bold text-slate-900 dark:text-white">Kalkulator Karbon Pohon</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:ring-offset-slate-800"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <SunIcon className="w-6 h-6 text-yellow-400"/> : <MoonIcon className="w-6 h-6 text-slate-600"/>}
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <PlotInput plot={plot} onChange={setPlot} />
            <TreeInputForm onAddTree={handleAddTree} />
          </div>

          <TreeList trees={trees} onRemoveTree={handleRemoveTree} />
          
          {trees.length > 0 && (
            <div className="text-center mt-8 animate-fade-in">
              <button
                onClick={handleCalculate}
                className="px-10 py-4 border border-transparent text-lg font-bold rounded-full shadow-lg text-white bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:scale-105 transition-transform duration-200 dark:ring-offset-slate-900"
              >
                Hitung Estimasi Karbon
              </button>
            </div>
          )}

          {results && (
            <div id="results-card" className="animate-fade-in">
                <ResultsDisplay 
                  results={results} 
                  plot={plot}
                  onGetFacts={handleGetFacts} 
                  geminiFacts={geminiFacts}
                  isGeminiLoading={isGeminiLoading}
                  mostCommonSpecies={mostCommonSpecies}
                />
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-6 mt-8 border-t dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">Dibuat dengan React, Tailwind, dan Gemini AI.</p>
      </footer>
    </div>
  );
}