import React, { useMemo, useCallback } from "react";
import { Responsive, useContainerWidth } from "react-grid-layout";
import { useLayoutContext } from "../context/LayoutContext";
import { BREAKPOINTS, COLS } from "../utils/layoutSync";
import { GridItem } from "./GridItem";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Main Component
export const SyncedGridLayout: React.FC = () => {
  const { layouts, updateLayout, syncAndSave } = useLayoutContext();
  const { width, containerRef, mounted } = useContainerWidth();
  
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState<string>("lg");
  // Keep track of the current breakpoint in a ref for use in stop handlers
  const breakpointRef = React.useRef(currentBreakpoint);
  
  React.useEffect(() => {
    breakpointRef.current = currentBreakpoint;
  }, [currentBreakpoint]);

  // Real-time Layout Change Handler (Local only)
  const onLayoutChange = useCallback((layout: any, allLayouts: any) => {
    if (mounted && width > 0) {
      updateLayout(layout, allLayouts, currentBreakpoint);
    }
  }, [updateLayout, currentBreakpoint, mounted, width]);

  // Persistence Handler (Sync all breakpoints when user interaction finishes)
  const onInteractionStop = useCallback((layout: any) => {
    syncAndSave(layout, breakpointRef.current);
  }, [syncAndSave]);

  // Breakpoint Handler
  const onBreakpointChange = useCallback((newBreakpoint: string) => {
    setCurrentBreakpoint(newBreakpoint);
  }, []);

  // Render Items
  const gridItems = useMemo(() => {
    return [0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i.toString()}>
        <GridItem id={i.toString()} />
      </div>
    ));
  }, []);

  return (
    <div className="layout-container" style={{ margin: "20px" }} ref={containerRef}>
      {mounted && (
        <Responsive
          className="layout"
          layouts={layouts}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={100}
          width={width}
          margin={[16, 16]}
          onLayoutChange={onLayoutChange}
          onBreakpointChange={onBreakpointChange}
          onDragStop={onInteractionStop}
          onResizeStop={onInteractionStop}
          dragConfig={{
            enabled: true,
          }}
          resizeConfig={{
            enabled: true,
            handles: ['se']
          }}
        >
          {gridItems}
        </Responsive>
      )}
    </div>
  );
};
