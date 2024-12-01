import {
  BezierEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "@xyflow/react";

const CustomEdge = (props: EdgeProps) => {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
    props;

  const [, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BezierEdge {...props} style={{ strokeWidth: 2, stroke: "yellow" }} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            left: `${labelX}px`,
            top: `${labelY}px`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "all",
          }}
          className="custom-edge-label"
        ></div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
