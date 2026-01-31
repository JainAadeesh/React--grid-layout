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
        
        <span>{id}</span>
        
        <div className="info-overlay">
          CARD_0{id}
        </div>
      </div>
    );
  }
);
