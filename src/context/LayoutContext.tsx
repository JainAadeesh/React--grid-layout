import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

import {
  generateInitialLayouts,
  loadLayoutFromStorage,
  saveLayoutToStorage,
  syncAllLayouts,
} from "../utils/layoutSync";
import type { Layout, Layouts } from "../utils/layoutSync";
import _ from "lodash";

interface LayoutContextType {
  layouts: Layouts;
  updateLayout: (currentLayout: Layout[], allLayouts: Layouts, currentBreakpoint: string) => void;
  syncAndSave: (currentLayout: Layout[], currentBreakpoint: string) => void;
  resetLayout: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Layout Provider
export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layouts, setLayouts] = useState<Layouts>(generateInitialLayouts());

  // Initial Load
  useEffect(() => {
    const saved = loadLayoutFromStorage();
    if (saved) {
      setLayouts(saved);
    }
  }, []);

  // Storage Sync Listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | Event) => {
      if (e.type === "storage" && (e as StorageEvent).key !== "rgl-layouts") return;
      
      const saved = loadLayoutFromStorage();
      if (saved) {
        setLayouts((prev: Layouts) => {
          if (!_.isEqual(prev, saved)) {
            return saved;
          }
          return prev;
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage-update", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage-update", handleStorageChange);
    };
  }, []);

  // Layout Update Logic (Local breakpoint only)
  const updateLayout = useCallback(
    (currentLayout: Layout[], allLayouts: Layouts, currentBreakpoint: string) => {
      const newLayouts = { ...layouts, ...allLayouts, [currentBreakpoint]: currentLayout };
      if (!_.isEqual(layouts, newLayouts)) {
        setLayouts(newLayouts);
      }
    },
    [layouts]
  );

  // Persistence Logic (Sync all breakpoints and Save)
  const syncAndSave = useCallback(
    (currentLayout: Layout[], currentBreakpoint: string) => {
      const newLayouts = syncAllLayouts(currentLayout, currentBreakpoint, layouts);
      if (!_.isEqual(layouts, newLayouts)) {
        setLayouts(newLayouts);
        saveLayoutToStorage(newLayouts);
      }
    },
    [layouts]
  );

  // Reset Layout
  const resetLayout = useCallback(() => {
    const initial = generateInitialLayouts();
    setLayouts(initial);
    saveLayoutToStorage(initial);
  }, []);

  const value = useMemo(() => ({
    layouts,
    updateLayout,
    syncAndSave,
    resetLayout
  }), [layouts, updateLayout, syncAndSave, resetLayout]);

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
};
