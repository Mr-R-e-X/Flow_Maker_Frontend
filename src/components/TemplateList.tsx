import { templateApi } from "@/constants/config";
import { removeTemplate, type template } from "@/store/slices/templateSlice";
import { TrashIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { memo } from "react";

const TemplateList = ({ templateList, handleRedirect, handleDelete }) => {
  return (
    <div className="relative overflow-y-auto max-h-64">
      <Table className="w-full text-sm">
        <TableHeader className="sticky top-0 bg-gray-700">
          <TableRow>
            <TableCell className="font-bold text-gray-200 p-4 border-b border-gray-600">
              Name
            </TableCell>
            <TableCell className="font-bold text-gray-200 p-4 border-b border-gray-600">
              Subject
            </TableCell>
            <TableCell className="font-bold text-gray-200 p-4 border-b border-gray-600"></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templateList.map((template: template) => (
            <TableRow
              key={template._id}
              className="hover:bg-gray-700 transition-colors cursor-pointer relative"
              onClick={() => handleRedirect(`/template-editor/${template._id}`)}
            >
              <TableCell className="p-4 border-b border-gray-600">
                {template.name}
              </TableCell>
              <TableCell className="p-4 border-b border-gray-600">
                {template.subject}
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
                      `${templateApi}/${template._id}`,
                      template._id,
                      removeTemplate
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

export default memo(TemplateList);
