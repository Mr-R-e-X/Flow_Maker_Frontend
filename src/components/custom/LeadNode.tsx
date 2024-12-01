/* eslint-disable @typescript-eslint/no-unused-vars */
import { Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "./CustomHandle";
import { Button } from "../ui/button";
import { Users, Edit } from "lucide-react";
import { memo, useState } from "react";
import { handleLeadSourceAlert } from "@/lib/flowUtils";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { CustomNode, setNodesData } from "@/store/slices/flowChartSlice";

export type LeadNodeProps = Node<
  { label: string; type: string; source: string },
  string
>;

const LeadNode = ({
  data: { label, type, source },
  id,
  selected,
}: NodeProps<LeadNodeProps>) => {
  const { setNodes } = useReactFlow();
  const [selectedOptions, setSelectedOptions] = useState<string>(source);
  const dispatch = useAppDispatch();
  const { leadSourceList } = useAppSelector((state) => state.list);

  const handleEditLeadSource = async () => {
    const value = await handleLeadSourceAlert(leadSourceList);
    console.log(value);
    if (value) {
      setSelectedOptions(value.element);
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === id) {
            node = {
              ...node,
              data: {
                ...node.data,
                source: value.value,
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
    <div className="flex flex-col items-center p-4 bg-white border-l-8 border-r-8 border-green-600 rounded-lg shadow-md min-w-max">
      <div className="flex w-full gap-4 items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <Users className="text-green-500 min-w-6 min-h-6" />
          <span className="text-gray-800 font-bold text-xl">{label}</span>
        </div>
        <Button
          size={"icon"}
          className="mt-2 bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-4 rounded focus:ring focus:ring-blue-500"
          onClick={handleEditLeadSource}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
      <div className="mt-2 text-sm text-green-600 font-semibold">
        {selectedOptions ? selectedOptions : "No Lead Source Selected"}
      </div>

      <CustomHandle
        type="source"
        position={Position.Bottom}
        style={{
          height: "15px",
          width: "15px",
          background: "white",
          border: "2px solid rgb(34 197 94)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

export default memo(LeadNode);
