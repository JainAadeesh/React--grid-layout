import { LayoutProvider } from "./context/LayoutContext";
import { SyncedGridLayout } from "./components/SyncedGridLayout";
import { useLayoutContext } from "./context/LayoutContext";

const Header = () => {
  const { resetLayout } = useLayoutContext();
  
  return (
    <header>
      <div className="flex items-center gap-4">
        <h1>Synced Grid Layout</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="status-indicator" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}></span>
          <span>Online Sync</span>
        </div>
        <button 
          onClick={resetLayout}
          className="reset-btn"
        >
          Reset View
        </button>
      </div>
    </header>
  );
};

function App() {
  return (
    <LayoutProvider>
      <div className="app-container">
        <Header />
        <main>
          <SyncedGridLayout />
        </main>
      </div>
    </LayoutProvider>
  );
}

export default App;
