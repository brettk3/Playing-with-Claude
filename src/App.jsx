import { useState } from 'react';
import './App.css';
import { HOLDINGS } from './data/holdings';
import { useAllStockData } from './hooks/useStockData';
import Sidebar from './components/Sidebar/Sidebar';
import StockDetail from './components/StockDetail/StockDetail';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const { allData, loading } = useAllStockData(HOLDINGS);

  const selectedHolding = HOLDINGS.find((h) => h.symbol === selectedSymbol);

  return (
    <div className="app">
      <Sidebar
        holdings={HOLDINGS}
        allData={allData}
        selectedSymbol={selectedSymbol}
        onSelect={setSelectedSymbol}
        loading={loading}
      />
      <main className="mainContent">
        {selectedSymbol ? (
          <StockDetail symbol={selectedSymbol} holding={selectedHolding} />
        ) : (
          <div className="welcomeState">
            <div className="welcomeIcon">&#9776;</div>
            <h2>Stock Portfolio Dashboard</h2>
            <p>Select a holding from the sidebar to view details</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
