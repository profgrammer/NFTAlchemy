import React from "react";
import { List, Avatar } from "antd";
import { useDrag } from "react-dnd";

function DraggableElement({ item }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "element",
    item: { id: item.token_id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <div ref={drag}>
      <List.Item style={{ border: isDragging ? "5px solid red" : "0px" }}>
        <List.Item.Meta
          avatar={<Avatar src={item?.image || "Error"} />}
          title={item.metadata?.name || "NFT Alchemy Token"}
          description={item.metadata?.description || "Description loading..."}
        />
      </List.Item>
    </div>
  );
}

export default DraggableElement;
