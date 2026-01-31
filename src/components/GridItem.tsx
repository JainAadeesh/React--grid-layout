import { forwardRef } from "react";
import classNames from "classnames";

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  dragging?: boolean;
}

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  ({ id, style, className, onMouseDown, onMouseUp, onTouchEnd, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={classNames("grid-item", `item-${id}`, className)}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        {...props}
      >
        <div className="drag-handle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <circle cx="4" cy="6" r="1"></circle>
            <circle cx="4" cy="12" r="1"></circle>
            <circle cx="4" cy="18" r="1"></circle>
          </svg>
        </div>
        
        <span>{id}</span>
        
        <div className="info-overlay">
          CARD_0{id}
        </div>
      </div>
    );
  }
);
