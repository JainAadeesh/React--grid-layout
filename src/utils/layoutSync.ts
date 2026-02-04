import _ from "lodash";

/* =========================
   Types
========================= */
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

/* =========================
   Grid Config
========================= */
export const BREAKPOINTS = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};

export const COLS = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2,
};

const ITEM_HEIGHT = 2;
const ITEMS = [0, 1, 2, 3, 4, 5];

/* =========================
   Helpers
========================= */

// Row-major sort (top → bottom, left → right)
export const sortLayout = (layout: Layout[]): Layout[] =>
  [...layout].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

// Items per row based on columns
const getItemsPerRow = (cols: number) => {
  if (cols >= 6) return 3; // lg, md, sm: 3 per row
  return 1;              // xs, xxs: 1 per row
};

// Generate layout for a breakpoint using ORDER
const buildLayout = (order: string[], cols: number): Layout[] => {
  const itemsPerRow = getItemsPerRow(cols);
  const itemWidth = Math.floor(cols / itemsPerRow);

  return order.map((id, index) => ({
    i: id,
    x: (index % itemsPerRow) * itemWidth,
    y: Math.floor(index / itemsPerRow) * ITEM_HEIGHT,
    w: itemWidth,
    h: ITEM_HEIGHT,
  }));
};

/* =========================
   Initial Layout Generator
========================= */
export const generateInitialLayouts = (): Layouts => {
  const order = ITEMS.map(String);

  const layouts: Layouts = {};
  Object.entries(COLS).forEach(([bp, cols]) => {
    layouts[bp] = buildLayout(order, cols);
  });

  return layouts;
};

/* =========================
   Sync Layouts (🔥 CORE FIX)
========================= */
export const syncAllLayouts = (
  changedLayout: Layout[]
): Layouts => {
  const orderedIds = sortLayout(changedLayout).map((l) => l.i);

  const newLayouts: Layouts = {};

  Object.entries(COLS).forEach(([bp, cols]) => {
    newLayouts[bp] = buildLayout(orderedIds, cols);
  });

  return newLayouts;
};


/* =========================
   Local Storage
========================= */
const STORAGE_KEY = "rgl-layouts";

export const saveLayoutToStorage = (layouts: Layouts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
    window.dispatchEvent(new Event("local-storage-update"));
  } catch (e) {
    console.warn("Failed to save layout:", e);
  }
};

export const loadLayoutFromStorage = (): Layouts | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("Failed to load layout:", e);
    return null;
  }
};
