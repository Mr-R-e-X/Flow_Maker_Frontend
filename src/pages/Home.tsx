/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteSourceApi, removeFlow, templateApi } from "@/constants/config";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/Layouts/Layout";
import { removeItemFromFlowList } from "@/store/slices/flowChartSlice";
import { removeItemFromList } from "@/store/slices/listSlice";
import { removeTemplate } from "@/store/slices/templateSlice";
import { ApiError, ApiResponse } from "@/types/responses";
import axios, { AxiosError } from "axios";
import { LoaderPinwheel, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const { flowList } = useAppSelector((state) => state.flow);
  const { templateList } = useAppSelector((state) => state.template);
  const { leadSourceList } = useAppSelector((state) => state.list);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleFlowItemClick = (id: string) => {
    navigate(`/flowchart/${id}`);
  };

  const handleLeadSourceRowClick = (id: string) => {
    navigate(`/lead-sources/${id}`);
  };
  const handleTemplateRowClick = (id: string) => {
    navigate(`/template-editor/${id}`);
  };

  const handleLeadSourceDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axios.delete<ApiResponse>(
        `${deleteSourceApi}/${id}`,
        {
          withCredentials: true,
        }
      );
      dispatch(removeItemFromList(id));
      toast({
        title: response.data.message || "Source deleted successfully",
        variant: "default",
        duration: 5000,
      });
    } catch (error: any) {
      const err = error as AxiosError<ApiError>;
      toast({
        title: err.response?.data.message || "Something went wrong !!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFlow = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axios.delete<ApiResponse>(`${removeFlow}/${id}`, {
        withCredentials: true,
      });
      dispatch(removeItemFromFlowList(id));
      toast({
        title: response.data.message || "Flow deleted successfully",
        variant: "default",
        duration: 5000,
      });
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      toast({
        title: err.response?.data.message || "Something went wrong !!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axios.delete<ApiResponse>(`${templateApi}/${id}`, {
        withCredentials: true,
      });
      dispatch(removeTemplate(id));
      toast({
        title: response.data.message || "Template deleted successfully",
        variant: "default",
        duration: 5000,
      });
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      toast({
        title: err.response?.data.message || "Something went wrong !!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] bg-gradient-to-b from-gray-900 to-black text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-12">
        Manage Sequences, Templates, and Sources
      </h1>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <LoaderPinwheel className="animate-spin text-green-300" size={64} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2  gap-8 w-full max-w-7xl">
        {/* Saved Flows Section */}
        <div className="bg-gray-800 rounded shadow-lg p-8 flex flex-col">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Saved Flows
          </h2>
          {flowList.length === 0 ? (
            <p className="text-gray-400 italic text-center">
              No Saved Flows Available!
            </p>
          ) : (
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
                  {flowList.map((flow) => (
                    <TableRow
                      key={flow._id}
                      className="hover:bg-gray-700 transition-colors cursor-pointer relative"
                      onClick={() => handleFlowItemClick(flow._id)}
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
                            handleDeleteFlow(flow._id);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded shadow-lg p-8 flex flex-col">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Saved Templates
          </h2>
          {templateList.length === 0 ? (
            <p className="text-gray-400 italic text-center">
              No Saved Templates Available!
            </p>
          ) : (
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
                  {templateList.map((template) => (
                    <TableRow
                      key={template._id}
                      className="hover:bg-gray-700 transition-colors cursor-pointer relative"
                      onClick={() => handleTemplateRowClick(template._id)}
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
                            handleDeleteTemplate(template._id);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded shadow-lg p-8 flex flex-col mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Saved Lead Sources
          </h2>
          {leadSourceList.length === 0 ? (
            <p className="text-gray-400 italic text-center">
              No Saved Leads Available!
            </p>
          ) : (
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
                  {leadSourceList.map((lead) => (
                    <TableRow
                      key={lead._id}
                      className="hover:bg-gray-700 transition-colors cursor-pointer relative"
                      onClick={() => handleLeadSourceRowClick(lead._id)}
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
                            handleLeadSourceDelete(lead._id);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const HomePage = Layout(Home, {
  title: "Home",
  description:
    "Create/Manage your sequences with automated emails & timely tasks.",
});

export default HomePage;
