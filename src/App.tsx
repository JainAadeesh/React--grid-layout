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
