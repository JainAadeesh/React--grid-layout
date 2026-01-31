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

// Sort Helper
export const sortLayout = (layout: Layout[]): Layout[] => {
  return [...layout].sort((a, b) => {
    if (a.y === b.y) return a.x - b.x;
    return a.y - b.y;
  });
};

// Mobile -> Web Mapping
export const mapMobileToWeb = (mobileLayout: Layout[], currentWebLayout: Layout[]): Layout[] => {
  const sortedMobile = sortLayout(mobileLayout);
  
  const sortedWebSlots = sortLayout(currentWebLayout).map(item => ({
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h
  }));

  return sortedMobile.map((mobileItem, index) => {
    const targetSlot = sortedWebSlots[index] || { x: 0, y: Infinity, w: 4, h: 2 }; 
    const originalWebItem = currentWebLayout.find(l => l.i === mobileItem.i);
    
    return {
      ...mobileItem,
      x: targetSlot.x,
      y: targetSlot.y,
      w: targetSlot.w,
      h: targetSlot.h,
      static: originalWebItem?.static,
    };
  });
};

// Web -> Mobile Mapping
export const mapWebToMobile = (webLayout: Layout[], currentMobileLayout: Layout[]): Layout[] => {
  const sortedWeb = sortLayout(webLayout);

  return sortedWeb.map((webItem, index) => {
    const originalMobileItem = currentMobileLayout.find(l => l.i === webItem.i);
    
    return {
      ...webItem,
      x: 0,
      y: index * 2,
      w: originalMobileItem ? originalMobileItem.w : 2,
      h: originalMobileItem ? originalMobileItem.h : 2,
      static: originalMobileItem?.static,
    };
  });
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
