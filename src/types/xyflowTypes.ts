import { type Node } from "@xyflow/react";

export type CustomTextNode = Node<{ text: string }, "text">;
export interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: string;
  targetPosition: string;
  style?: React.CSSProperties;
  markerEndId?: string;
  arrowHeadType?: string;
  data?: { onAdd?: () => void };
}
