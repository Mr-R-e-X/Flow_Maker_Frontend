/* eslint-disable @typescript-eslint/no-unused-vars */
import { Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "./CustomHandle";
import { Button } from "../ui/button";
import { Clock, Edit, X } from "lucide-react";
import { memo, useState } from "react";
import { handleDelaySourceAlert } from "@/lib/flowUtils";
import { useAppDispatch } from "@/hooks/hooks";
import {
  CustomNode,
  removeNode,
  setNodesData,
} from "@/store/slices/flowChartSlice";

type CustomNodeProps = Node<
  { label: string; type: string; delay?: string },
  string
>;

const DelayNode = ({
  data: { label, type, delay },
  id,
  selected,
}: NodeProps<CustomNodeProps>) => {
  const { setNodes } = useReactFlow();
  const [nodeDelay, setNodeDelay] = useState(delay || "0 minutes");
  const dispatch = useAppDispatch();

  const handleEditDelay = async () => {
    const value = await handleDelaySourceAlert();
    if (value) {
      setNodeDelay(value);
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === id) {
            node = {
              ...node,
              data: {
                ...node.data,
                delay: value,
                source: value,
              },
            };
            dispatch(setNodesData(node as CustomNode));
          }
          return node;
        })
      );
    }
  };

  return (
    <>
      <div className="flex flex-col items-center p-4 bg-white border-l-8 border-r-8 border-orange-600 rounded-lg shadow-md min-w-max">
        <div className="flex w-full gap-4 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Clock className="text-orange-600 min-w-6 min-h-6" />
            <span className="text-gray-800 font-bold text-xl">{label}</span>
          </div>
          {selected && (
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500 hover:bg-red-400 hover:text-black"
              onClick={() => {
                setNodes((prevNodes) =>
                  prevNodes.filter((node) => node.id !== id)
                );
                dispatch(removeNode(id));
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="mt-2 text-orange-600 text-sm font-semibold">
          {nodeDelay}
        </div>
        <Button
          size={"icon"}
          className="mt-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-4 rounded focus:ring focus:ring-orange-500"
          onClick={handleEditDelay}
        >
          <Edit className="w-4 h-4" />
        </Button>

        <CustomHandle
          type="target"
          position={Position.Top}
          style={{
            height: "15px",
            width: "15px",
            background: "white",
            border: "2px solid rgb(249 115 22)",
            borderRadius: "50%",
          }}
        />
        <CustomHandle
          type="source"
          position={Position.Bottom}
          style={{
            height: "15px",
            width: "15px",
            background: "white",
            border: "2px solid rgb(249 115 22)",
            borderRadius: "50%",
          }}
        />
      </div>
    </>
  );
};

export default memo(DelayNode);
