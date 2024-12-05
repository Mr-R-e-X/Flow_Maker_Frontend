import { removeFlow } from "@/constants/config";
import {
  removeItemFromFlowList,
  type FlowList,
} from "@/store/slices/flowChartSlice";
import { TrashIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { memo } from "react";

const FlowList = ({ flowList, handleRedirect, handleDelete }) => {
  return (
    <div className="relative overflow-y-auto max-h-64">
      <Table className="w-full text-sm">
        <TableHeader className="sticky top-0 bg-gray-700">
          <TableRow>
            <TableCell className="font-bold text-gray-200 p-4 border-b border-gray-600">
              Title
            </TableCell>
            <TableCell className="font-bold text-gray-200 p-4 border-b border-gray-600">
              Description
            </TableCell>
            <TableCell className="font-bold text-gray-200 p-4 border-b border-gray-600">
              {/* <ActivityIcon /> */}
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flowList.map((flow: FlowList) => (
            <TableRow
              key={flow._id}
              className="hover:bg-gray-700 transition-colors cursor-pointer relative"
              onClick={() => handleRedirect(`/flowchart/${flow._id}`)}
            >
              <TableCell className="p-4 border-b border-gray-600">
                {flow.title}
              </TableCell>
              <TableCell className="p-4 border-b border-gray-600">
                {flow.description}
              </TableCell>
              <TableCell className="p-4 border-b border-gray-600"></TableCell>
              <TableCell className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <TrashIcon
                  className="w-6 h-6 text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(
                      `${removeFlow}/${flow._id}`,
                      flow._id,
                      removeItemFromFlowList
                    );
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default memo(FlowList);
