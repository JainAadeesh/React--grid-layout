import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

import {
  generateInitialLayouts,
  loadLayoutFromStorage,
  saveLayoutToStorage,
  mapMobileToWeb,
  mapWebToMobile,
} from "../utils/layoutSync";
import type { Layout, Layouts } from "../utils/layoutSync";
import _ from "lodash";

interface LayoutContextType {
  layouts: Layouts;
  updateLayout: (currentLayout: Layout[], allLayouts: Layouts, currentBreakpoint: string) => void;
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

  // Layout Update Logic
  const updateLayout = useCallback(
    (currentLayout: Layout[], allLayouts: Layouts, currentBreakpoint: string) => {
      const isMobile = currentBreakpoint === "xs" || currentBreakpoint === "xxs";
      let newLayouts = { ...layouts, ...allLayouts };

      if (isMobile) {
        // Mobile Sync
        const currentWebLayout = layouts.lg || generateInitialLayouts().lg;
        const newWebLayout = mapMobileToWeb(currentLayout, currentWebLayout);
        
        newLayouts = {
          ...newLayouts,
          [currentBreakpoint]: currentLayout, 
          lg: newWebLayout,
          md: newWebLayout,
          sm: newWebLayout,
        };
      } else {
        // Web Sync
        const currentMobileLayout = layouts.xs || generateInitialLayouts().xs;
        const newMobileLayout = mapWebToMobile(currentLayout, currentMobileLayout);
        
        newLayouts = {
          ...newLayouts,
          [currentBreakpoint]: currentLayout,
          xs: newMobileLayout,
          xxs: newMobileLayout, 
          lg: currentLayout,
          md: currentLayout,  
          sm: currentLayout,
        };
      }

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
    resetLayout
  }), [layouts, updateLayout, resetLayout]);

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
