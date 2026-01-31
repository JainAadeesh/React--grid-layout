import React, { useMemo, useCallback } from "react";
import { Responsive, useContainerWidth } from "react-grid-layout";
import { useLayoutContext } from "../context/LayoutContext";
import { BREAKPOINTS, COLS } from "../utils/layoutSync";
import { GridItem } from "./GridItem";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Main Component
export const SyncedGridLayout: React.FC = () => {
  const { layouts, updateLayout } = useLayoutContext();
  const { width, containerRef, mounted } = useContainerWidth();
  
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState<string>("lg");

  // Layout Change Handler
  const onLayoutChange = useCallback((layout: any, allLayouts: any) => {
    updateLayout(layout, allLayouts, currentBreakpoint);
  }, [updateLayout, currentBreakpoint]);

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
          dragConfig={{
            handle: ".drag-handle",
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
