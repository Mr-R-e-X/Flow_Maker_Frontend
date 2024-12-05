import { deleteSourceApi } from "@/constants/config";
import { removeItemFromList, singeList } from "@/store/slices/listSlice";
import { TrashIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { memo } from "react";

const LeadSourceList = ({ leadSourceList, handleRedirect, handleDelete }) => {
  return (
    <div className="relative overflow-y-auto max-h-64">
      <Table className="w-full text-sm">
        <TableHeader className="sticky top-0 bg-gray-700">
          <TableRow>
            <TableCell className="font-bold text-gray-200 p-4 border-b border-gray-600">
              Name
            </TableCell>

            <TableCell className="font-bold text-gray-200 p-4 border-b border-gray-600"></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leadSourceList.map((lead: singeList) => (
            <TableRow
              key={lead._id}
              className="hover:bg-gray-700 transition-colors cursor-pointer relative"
              onClick={() => handleRedirect(`/lead-sources/${lead._id}`)}
            >
              <TableCell className="p-4 border-b border-gray-600">
                {lead.name}
              </TableCell>
              <TableCell className="p-4 border-b border-gray-600">
                {/* Empty to reserve space */}
              </TableCell>
              <TableCell className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <TrashIcon
                  className="w-6 h-6 text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(
                      `${deleteSourceApi}/${lead._id}`,
                      lead._id,
                      removeItemFromList
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

export default memo(LeadSourceList);
