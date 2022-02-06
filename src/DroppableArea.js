import DraggableElement from "components/DraggableElement";
import React from "react";
import { useDrop } from "react-dnd";

function DroppableArea({ items, addItem }) {
  /* eslint-disable no-unused-vars */
  /* eslint-disable no-unused-labels */
  const [collectedProps, drop] = useDrop(() => ({
    accept: "element",
    drop: (item) => addItem(item.id),
    collect: (monitor) => {
      isOver: !!monitor.isOver();
    },
  }));
  /* eslint-enable no-unused-vars */

  return (
    <div
      ref={drop}
      style={{
        float: "right",
        height: "500px",
        width: "500px",
        border: "5px solid black",
        overflow: "auto",
      }}
    >
      {items?.map((item) => (
        <DraggableElement item={item} />
      ))}
    </div>
  );
}

export default DroppableArea;
