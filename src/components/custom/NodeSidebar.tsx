import { COMPONENTS, NodeType } from "@/constants/data";
import { DragEvent, useMemo } from "react";
// import { Button } from "../ui/button";

const NodeSidebar = ({
  onDragStart,
}: {
  onDragStart: (
    event: DragEvent<HTMLButtonElement>,
    type: (typeof NodeType)[keyof typeof NodeType]
  ) => void;
}) => {
  const memoizedComponents = useMemo(
    () =>
      COMPONENTS.map((component) => (
        <button
          // variant={"outline"}
          key={component.label}
          aria-label={component.label}
          className="rounded-md p-1 hover:bg-gray-700 focus:outline-none"
          onDragStart={(event) => onDragStart(event, component.type)}
          draggable
        >
          {component.icon}
        </button>
      )),
    [onDragStart]
  );

  return (
    <div className="flex flex-col gap-2 justify-center my-4 items-center max-w-full">
      <div>
        <h2 className="text-sm font-semibold">Drag & Drop the Elements</h2>
        <div className="flex mt-2 gap-3 flex-wrap justify-center">
          {memoizedComponents}
        </div>
      </div>
    </div>
  );
};

export default NodeSidebar;
