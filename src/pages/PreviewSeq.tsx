/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getFlow } from "@/constants/config";
import { useToast } from "@/hooks/use-toast";
import { LoaderPinwheel } from "lucide-react";
import EmailNode from "@/components/custom/EmailNode";
import DelayNode from "@/components/custom/DelayNode";
import LeadNode from "@/components/custom/LeadNode";
import CustomEdge from "@/components/custom/CustomEdge";
import { ApiError, ApiResponse } from "@/types/responses";
import Layout from "@/Layouts/Layout";

const nodeTypes = {
  Email: EmailNode,
  Delay: DelayNode,
  Lead: LeadNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

const PreviewSeq: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<ApiResponse>(`${getFlow}/${id}`, {
          withCredentials: true,
        });

        const flowData = response.data?.data?.[0];
        if (!flowData) {
          throw new Error("Flow data not found.");
        }

        console.log(flowData);

        setNodes(
          flowData.nodeDetails.map((node: any) => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: {
              ...node.data,
              label: node.data?.label || `Node ${node.id}`,
            },
            draggable: false,
            selectable: false,
            deletable: false,
          }))
        );

        setEdges(
          flowData.edgeDetails.map((edge: any) => ({
            id: edge.id || `${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            type: edge.type || "custom",
            animated: edge.animated || false,
            label: edge.label || "",
            deletable: false,
          }))
        );

        setName(flowData.title);
      } catch (error) {
        const err = error as AxiosError<ApiError>;
        toast({
          title: err.response?.data?.message || "Error fetching flow data",
          variant: "destructive",
          duration: 5000,
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, setEdges, setNodes, toast]);

  const handleNodesChange = (changes: any) => {
    const filteredChanges = changes.filter(
      (change: any) => change.type !== "remove"
    );
    onNodesChange(filteredChanges);
  };

  const handleEdgesChange = (changes: any) => {
    const filteredChanges = changes.filter(
      (change: any) => change.type !== "remove"
    );
    onEdgesChange(filteredChanges);
  };

  return (
    <div className="h-[calc(100vh-6rem)] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        zoomOnScroll={false}
        zoomOnPinch
        fitView
        fitViewOptions={{ maxZoom: 1 }}
        className="bg-gradient-to-b from-gray-900 to-black text-black"
        nodesConnectable={false}
        nodesDraggable={false}
        edgesFocusable={false}
        elementsSelectable={false}
      >
        <Panel
          position="top-left"
          style={{
            border: "1px solid #ccc",
            padding: 12,
            borderRadius: 12,
            backgroundImage: "linear-gradient(to bottom, #111827, #000000)",
            width: "max-content",
            height: "max-content",
            overflowY: "auto",
            color: "white",
          }}
        >
          <div className="flex items-center gap-2 font-bold">
            <input
              type="text"
              value={name}
              disabled
              className="text-center text-xl bg-transparent border-none outline-none w-max overflow-x-auto text-white"
            />
          </div>
        </Panel>

        <Background />
        <Controls />
        <MiniMap bgColor="black" nodeColor={() => "yellow"} />
      </ReactFlow>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <LoaderPinwheel className="animate-spin text-green-300" size={64} />
        </div>
      )}
    </div>
  );
};

const PreviewSeqPage = Layout(PreviewSeq, {
  title: "Preview Sequence",
  description: "Preview your sequence",
});

export default PreviewSeqPage;
