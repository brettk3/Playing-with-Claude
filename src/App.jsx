import { useState } from 'react';
import './App.css';
import { useWatchlist } from './hooks/useWatchlist';
import { useAllStockData } from './hooks/useStockData';
import { useChat } from './hooks/useChat';
import Sidebar from './components/Sidebar/Sidebar';
import StockDetail from './components/StockDetail/StockDetail';
import ChatPanel from './components/ChatPanel/ChatPanel';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [chatOpen, setChatOpen] = useState(true);
  const { holdings, addTicker, removeTicker } = useWatchlist();
  const { allData, loading } = useAllStockData(holdings);
  const { messages, loading: chatLoading, sendMessage, clearChat } = useChat();

  const selectedHolding = holdings.find((h) => h.symbol === selectedSymbol);
  const selectedStockData = selectedSymbol ? allData[selectedSymbol]?.data : null;

  const handleChatSend = (message) => {
    sendMessage(message, selectedStockData);
  };

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
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3v18h18" />
                <path d="M7 16l4-6 4 4 5-8" />
              </svg>
            </div>
            <h2>Select a stock to analyze</h2>
            <p>Pick a ticker from your watchlist to view charts and AI insights</p>
          </div>
        )}
      </main>

      {chatOpen && (
        <aside className="chatSidebar">
          <ChatPanel
            messages={messages}
            loading={chatLoading}
            onSend={handleChatSend}
            onClear={clearChat}
            stockData={selectedStockData}
          />
        </aside>
      )}

      <button
        className={`chatToggle ${chatOpen ? 'chatToggleActive' : ''}`}
        onClick={() => setChatOpen(!chatOpen)}
        title={chatOpen ? 'Close chat' : 'Open AI chat'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  );
}

export default App;
