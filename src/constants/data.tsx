import { Clock, Mail } from "lucide-react";

export const NodeType = {
  Email: "Email",
  Delay: "Delay",
} as const;

export type Node = {
  label: string;
  type: (typeof NodeType)[keyof typeof NodeType];
  icon: React.ReactNode;
};

export const NODES: Node[] = [
  {
    label: "Email",
    type: NodeType.Email,
    icon: <Mail className="text-blue-500 w-10 h-10" size={40} />,
  },
  {
    label: "Delay",
    type: NodeType.Delay,
    icon: <Clock className="text-yellow-500 w-10 h-10" size={40} />,
  },
];
export const COMPONENTS = [...NODES];
