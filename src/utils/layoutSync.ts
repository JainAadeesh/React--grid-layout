import _ from "lodash";

// Types
export interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  [key: string]: any;
}

export interface Layouts {
  [key: string]: Layout[];
}

// Config
export const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
export const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

const INITIAL_ITEMS = [0, 1, 2, 3, 4, 5];

// Generate Default Layouts
export const generateInitialLayouts = (): Layouts => {
  // Randomize order on initialization
  const shuffled = _.shuffle(INITIAL_ITEMS);

  const lgLayout: Layout[] = shuffled.map((i, index) => ({
    i: i.toString(),
    x: (index % 3) * 4,
    y: Math.floor(index / 3) * 2,
    w: 4,
    h: 2,
  }));

  const xsLayout: Layout[] = shuffled.map((i, index) => ({
    i: i.toString(),
    x: 0,
    y: index * 2,
    w: 2,
    h: 2,
  }));

  return {
    lg: lgLayout,
    md: lgLayout,
    sm: lgLayout,
    xs: xsLayout,
    xxs: xsLayout,
  };
};

// Helper to determine items per row based on column count
const getItemsPerRow = (cols: number) => {
  if (cols >= 12) return 3; // lg
  if (cols >= 10) return 3; // md
  if (cols >= 6) return 2;  // sm
  return 1;                 // xs, xxs
};

// Sort Helper - Row-major order (top to bottom, left to right)
export const sortLayout = (layout: Layout[]): Layout[] => {
  return [...layout].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });
};

// Sync logic: Force all layouts into a stable sequential flow based on sorted order
export const syncAllLayouts = (
  changedLayout: Layout[],
  currentBreakpoint: string,
  allLayouts: Layouts
): Layouts => {
  const sortedItems = sortLayout(changedLayout).map(item => item.i);
  const newLayouts: Layouts = { ...allLayouts };

  Object.keys(COLS).forEach((breakpoint) => {
    const cols = (COLS as any)[breakpoint];
    const itemsPerRow = getItemsPerRow(cols);
    const itemWidth = Math.floor(cols / itemsPerRow);
    
    newLayouts[breakpoint] = sortedItems.map((id, index) => {
      const x = (index % itemsPerRow) * itemWidth;
      const y = Math.floor(index / itemsPerRow) * 2;

      return {
        i: id,
        x: x,
        y: y,
        w: itemWidth,
        h: 2
      };
    });
  });

  return newLayouts;
};

// Local Storage Save
export const saveLayoutToStorage = (layouts: Layouts) => {
  if (!layouts) return;
  try {
    localStorage.setItem("rgl-layouts", JSON.stringify(layouts));
    window.dispatchEvent(new Event("local-storage-update"));
  } catch (e) {
    console.warn("Failed to save layout to localStorage:", e);
  }
};

// Local Storage Load
export const loadLayoutFromStorage = (): Layouts | null => {
  try {
    const saved = localStorage.getItem("rgl-layouts");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.warn("Failed to load layout from localStorage:", e);
    return null;
  }
};
