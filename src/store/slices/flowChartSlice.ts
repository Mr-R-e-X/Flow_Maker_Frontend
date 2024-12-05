import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Edge, Node } from "@xyflow/react";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { v4 as uuid } from "uuid";

export interface FlowList {
  _id: string;
  title: string;
  description: string;
}

export interface CustomNode extends Node {
  _id?: string;
  data: {
    label: string;
    source: string;
    type: string;
  };
}

interface Flow {
  id: string;
  name: string;
  description: string;
  nodes: CustomNode[];
  edges: Edge[];
  flowList: FlowList[];
}

const initialState: Flow = {
  id: "",
  name: "",
  description: "",
  nodes: [
    {
      id: `Lead-${uuid()}`,
      _id: "",
      type: "Lead",
      position: { x: 0, y: 0 },
      data: {
        label: "Lead",
        type: "Lead",
        source: "",
      },
    },
  ],
  edges: [],
  flowList: [],
};

const flowChartSlice = createSlice({
  name: "flowChart",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },

    addNodes: (state, action: PayloadAction<CustomNode>) => {
      state.nodes.push(action.payload);
      const lastNode = state.nodes[state.nodes.length - 2];
      if (lastNode) {
        const newEdge: Edge = {
          id: `e-${lastNode.id}-${action.payload.id}`,
          source: lastNode.id,
          target: action.payload.id,
          type: "custom",
          animated: true,
        };
        state.edges.push(newEdge);
      }
    },

    addEdges: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },

    setNodesData: (state, action: PayloadAction<CustomNode>) => {
      state.nodes = state.nodes.map((node) =>
        node.id === action.payload.id
          ? { ...node, data: action.payload.data }
          : node
      );
    },

    removeNode: (state, action: PayloadAction<string>) => {
      const nodeIdToRemove = action.payload;

      const connectedEdges = state.edges.filter(
        (edge) =>
          edge.source === nodeIdToRemove || edge.target === nodeIdToRemove
      );
      const incomingEdge = connectedEdges.find(
        (edge) => edge.target === nodeIdToRemove
      );
      const outgoingEdge = connectedEdges.find(
        (edge) => edge.source === nodeIdToRemove
      );

      state.nodes = state.nodes.filter((node) => node.id !== nodeIdToRemove);
      state.edges = state.edges.filter(
        (edge) =>
          edge.source !== nodeIdToRemove && edge.target !== nodeIdToRemove
      );

      if (incomingEdge && outgoingEdge) {
        const newEdge: Edge = {
          id: `e-${incomingEdge.source}-${outgoingEdge.target}`,
          source: incomingEdge.source,
          target: outgoingEdge.target,
          type: "custom",
          animated: true,
        };
        state.edges.push(newEdge);
      }
    },

    onNodesChange: (state, action) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    onEdgesChange: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    onConnect: (state, action) => {
      state.edges = addEdge(action.payload, state.edges);
    },
    setFlowList: (state, action: PayloadAction<FlowList[]>) => {
      state.flowList = action.payload;
    },
    removeItemFromFlowList: (state, action: PayloadAction<string>) => {
      state.flowList = state.flowList.filter(
        (data) => data._id !== action.payload
      );
    },
  },
});

export const {
  setName,
  setDescription,
  addNodes,
  addEdges,
  setNodesData,
  removeNode,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setFlowList,
  removeItemFromFlowList,
} = flowChartSlice.actions;

export default flowChartSlice.reducer;
