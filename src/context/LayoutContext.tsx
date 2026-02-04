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
  syncAndSave: (currentLayout: Layout[]) => void;
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
      // If it's a standard storage event from another tab, check the key
      if (e.type === "storage" && (e as StorageEvent).key !== "rgl-layouts") return;
      
      // Load and update state
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
    (currentLayout: Layout[], _allLayouts: Layouts, currentBreakpoint: string) => {
      setLayouts((prev) => {
        const newLayouts = { ...prev, [currentBreakpoint]: currentLayout };
        if (!_.isEqual(prev, newLayouts)) {
          return newLayouts;
        }
        return prev;
      });
    },
    []
  );

  // Persistence Logic (Sync all breakpoints and Save)
  const syncAndSave = useCallback(
    (currentLayout: Layout[]) => {
      const newLayouts = syncAllLayouts(currentLayout);
      setLayouts((prev) => {
        if (!_.isEqual(prev, newLayouts)) {
          saveLayoutToStorage(newLayouts);
          return newLayouts;
        }
        return prev;
      });
    },
    []
  );


  const value = useMemo(() => ({
    layouts,
    updateLayout,
    syncAndSave
  }), [layouts, updateLayout, syncAndSave]);

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
