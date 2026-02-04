import { LayoutProvider } from "./context/LayoutContext";
import { SyncedGridLayout } from "./components/SyncedGridLayout";

const Header = () => {
  
  return (
    <header>
      <div className="flex items-center gap-4">
        <h1>Synced Grid Layout</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
