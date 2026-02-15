import { useState } from 'react';
import './App.css';
import { useWatchlist } from './hooks/useWatchlist';
import { useAllStockData } from './hooks/useStockData';
import Sidebar from './components/Sidebar/Sidebar';
import StockDetail from './components/StockDetail/StockDetail';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const { holdings, addTicker, removeTicker } = useWatchlist();
  const { allData, loading } = useAllStockData(holdings);

  const selectedHolding = holdings.find((h) => h.symbol === selectedSymbol);

  return (
    <div className="app">
      <Sidebar
        holdings={holdings}
        allData={allData}
        selectedSymbol={selectedSymbol}
        onSelect={setSelectedSymbol}
        onAdd={addTicker}
        onRemove={removeTicker}
        loading={loading}
      />
      <main className="mainContent">
        {selectedSymbol ? (
          <StockDetail symbol={selectedSymbol} holding={selectedHolding} />
        ) : (
          <div className="welcomeState">
            <div className="welcomeIcon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3v18h18" />
                <path d="M7 16l4-6 4 4 5-8" />
              </svg>
            </div>
            <h2>Select a ticker to get started</h2>
            <p>Choose from your watchlist or add a new symbol</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
