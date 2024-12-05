/* eslint-disable @typescript-eslint/no-unused-vars */
import { Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "./CustomHandle";
import { Button } from "../ui/button";
import { Mail, Edit, X } from "lucide-react";
import { memo, useState } from "react";
import { handleEmailSourceAlert } from "@/lib/flowUtils";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  CustomNode,
  removeNode,
  setNodesData,
} from "@/store/slices/flowChartSlice";

type EmailNodeProps = Node<
  { label: string; type: string; template?: string },
  string
>;

const EmailNode = ({
  data: { label, type, template },
  id,
  selected,
}: NodeProps<EmailNodeProps>) => {
  const { setNodes } = useReactFlow();
  const [nodeTemplate, setNodeTemplate] = useState(
    template || "No Template Selected"
  );
  const dispatch = useAppDispatch();
  const { templateList } = useAppSelector((state) => state.template);

  const handleEditTemplate = async () => {
    const { value, element } = await handleEmailSourceAlert(templateList);

    if (value) {
      setNodeTemplate(element);
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === id) {
            node = {
              ...node,
              data: {
                ...node.data,
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
      <div className="flex flex-col items-center p-4 bg-white border-l-8 border-r-8 border-blue-600 rounded-lg shadow-md min-w-max">
        <div className="flex w-full gap-4 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Mail className="text-blue-600 min-w-6 min-h-6" />
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
        <div className="mt-2 text-blue-600 text-sm font-semibold">
          {nodeTemplate}
        </div>
        <Button
          size={"icon"}
          className="mt-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-4 rounded focus:ring focus:ring-blue-500"
          onClick={handleEditTemplate}
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
            border: "2px solid rgb(59 130 246)",
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
            border: "2px solid rgb(59 130 246)",
            borderRadius: "50%",
          }}
        />
      </div>
    </>
  );
};

export default memo(EmailNode);
