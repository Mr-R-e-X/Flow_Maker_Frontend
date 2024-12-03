import CustomEdge from "@/components/custom/CustomEdge";
import DelayNode from "@/components/custom/DelayNode";
import EmailNode from "@/components/custom/EmailNode";
import LeadNode from "@/components/custom/LeadNode";
import NodeSidebar from "@/components/custom/NodeSidebar";
import { Button } from "@/components/ui/button";
import {
  createEdgeApi,
  createFlowApi,
  createNodeApi,
} from "@/constants/config";
import { NODES, NodeType } from "@/constants/data";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/Layouts/Layout";
import {
  basicNoty,
  checkAllNodeValid,
  createNodeandEdgeIdList,
  handleSaveSequence,
  promptEditSequenceName,
  promptSequenceName,
} from "@/lib/flowUtils";
import {
  addNodes,
  CustomNode,
  onEdgesChange,
  onNodesChange,
  setName,
} from "@/store/slices/flowChartSlice";
import { ApiError, ApiResponse } from "@/types/responses";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import axios, { AxiosError } from "axios";
import { Edit, LoaderPinwheel } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

const nodeTypes = {
  Email: EmailNode,
  Delay: DelayNode,
  Lead: LeadNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

const FlowChart = () => {
  const { nodes, edges, name } = useAppSelector((state) => state.flow);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) {
      const setInitialName = async () => {
        const result = await promptSequenceName();
        dispatch(setName(result?.value));
      };
      setInitialName();
    }
  }, [dispatch, name]);

  const dragOutSideRef = useRef<
    (typeof NodeType)[keyof typeof NodeType] | null
  >(null);

  const { screenToFlowPosition } = useReactFlow();

  const onDragStart = useCallback(
    (
      event: React.DragEvent<HTMLButtonElement>,
      type: (typeof NodeType)[keyof typeof NodeType]
    ) => {
      dragOutSideRef.current = type;
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const onDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );

  const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      const type = dragOutSideRef.current;
      if (!type) return;

      const nodeDetails = NODES.find((n) => n.type === type);
      if (!nodeDetails) return;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: CustomNode = {
        id: `${type}-${uuid()}`,
        type,
        position,
        data: {
          label: nodeDetails.label,
          type: nodeDetails.type,
          source: "",
        },
      };
      dispatch(addNodes(newNode));
    },
    [screenToFlowPosition, dispatch]
  );

  const handleEditClick = async () => {
    const res = await promptEditSequenceName(name);
    dispatch(setName(res?.value));
  };

  const handleSaveClick = async () => {
    const allNodeValid = checkAllNodeValid(nodes);
    if (!allNodeValid) {
      basicNoty(
        "error",
        "Not Valid Data!",
        "Please make sure you selected all the required fields data.",
        "OK"
      );
      return;
    }
    const data = await handleSaveSequence(name);

    console.log(data.name);
    console.log(data.description);

    if (!data) return;
    console.log(nodes);
    try {
      setIsLoading(true);
      const [createNodesRes, createEdgeRes] = await Promise.all([
        axios.post<ApiResponse>(
          createNodeApi,
          { nodesList: nodes },
          { withCredentials: true }
        ),
        axios.post<ApiResponse>(
          createEdgeApi,
          { edgesList: edges },
          { withCredentials: true }
        ),
      ]);

      const { nodes: nodeIds, edges: edgeIds } = createNodeandEdgeIdList(
        createNodesRes.data,
        createEdgeRes.data
      );

      const createdFlowRes = await axios.post<ApiResponse>(
        createFlowApi,
        {
          title: data.name,
          description: data.description,
          nodes: nodeIds,
          edges: edgeIds,
        },
        { withCredentials: true }
      );

      toast({
        title: createdFlowRes.data.message,
        variant: "default",
        duration: 5000,
      });

      navigate("/");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      toast({
        title: err.response?.data.message || "An unexpected error occurred",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => dispatch(onNodesChange(changes))}
        onEdgesChange={(changes) => dispatch(onEdgesChange(changes))}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        zoomOnScroll={false}
        zoomOnPinch
        fitView
        fitViewOptions={{ maxZoom: 1 }}
        className="bg-gradient-to-b from-gray-900 to-black text-black"
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
              onChange={(e) => dispatch(setName(e.target.value))}
              className="text-center text-xl bg-transparent border-none outline-none w-max overflow-x-auto text-white"
            />
            <Edit className="cursor-pointer" onClick={handleEditClick} />
          </div>
          <NodeSidebar onDragStart={onDragStart} />
          <Button
            variant={"secondary"}
            className="mt-4 w-full bg-blue-700"
            onClick={handleSaveClick}
          >
            Save Sequence
          </Button>
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

const FlowChartPage = Layout(FlowChart, {
  title: "Flowchart",
  description: "Create your flowchart",
});
export default FlowChartPage;
