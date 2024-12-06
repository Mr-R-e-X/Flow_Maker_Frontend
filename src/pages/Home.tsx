import FlowList from "@/components/FlowList";
import LeadSourceList from "@/components/LeadSourceList";
import TemplateList from "@/components/TemplateList";
import { getUserProfileApi } from "@/constants/config";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/Layouts/Layout";
import { HomeShimmer } from "@/Layouts/Loaders";
import { setProfile } from "@/store/slices/authSlice";
import { setFlowList } from "@/store/slices/flowChartSlice";
import { setList } from "@/store/slices/listSlice";
import { setTemplateList } from "@/store/slices/templateSlice";
import { ApiError, ApiResponse } from "@/types/responses";
import { UnknownAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { FileText, Plus, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { flowList } = useAppSelector((state) => state.flow);
  const { templateList } = useAppSelector((state) => state.template);
  const { leadSourceList } = useAppSelector((state) => state.list);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<ApiResponse>(getUserProfileApi, {
          withCredentials: true,
        });

        const { user, flows, templates, leads } = response.data.data || {};

        dispatch(setProfile(user));
        dispatch(setFlowList(flows || []));
        dispatch(setTemplateList(templates || []));
        dispatch(setList(leads || []));

        toast({
          title: `Welcome ${user?.name || "User"}!`,
          variant: "default",
          duration: 3000,
        });
      } catch (error) {
        const err = error as AxiosError<ApiError>;
        toast({
          title: err.response?.data.message || "Failed to load profile!",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [dispatch, toast]);

  const handleRedirect = (urlStr: string) => {
    navigate(urlStr);
  };

  const handleDelete = async (
    url: string,
    id: string,
    valueSetter: (id: string) => UnknownAction
  ) => {
    try {
      const response = await axios.delete<ApiResponse>(url, {
        withCredentials: true,
      });
      toast({
        title: response.data.message,
        variant: "default",
        duration: 5000,
      });
      const action = valueSetter(id);
      dispatch(action);
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      toast({
        title: err.response?.data.message || "Something went wrong!",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (isFetching) {
    return <HomeShimmer />;
  }

  return (
    <div className="h-[calc(100vh-6rem)] bg-gradient-to-b from-gray-900 to-black text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl py-2 font-bold text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 mb-8">
        Manage Your Workflow
      </h1>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
        {/* Flows Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col space-y-4">
          <div className="flex justify-between items-center mb-6 relative">
            <h2 className="text-2xl font-semibold text-center text-green-400">
              <FileText size={22} className="inline mr-2" />
              Saved Flows
            </h2>
            {/* Add New Flow Button */}
            {flowList.length > 0 && (
              <button
                onClick={() => handleRedirect("/flowchart")}
                className=" p-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                <span className="flex items-center space-x-2">
                  <Plus size={18} />
                </span>
              </button>
            )}
          </div>
          {flowList.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-400 italic mb-4">
                No Saved Flows Available!
              </p>
              <button
                onClick={() => handleRedirect("/flowchart")}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                <span className="flex items-center space-x-2">
                  <Plus size={18} />
                  <span>Create New Flow</span>
                </span>
              </button>
            </div>
          ) : (
            <FlowList
              flowList={flowList}
              handleRedirect={handleRedirect}
              handleDelete={handleDelete}
            />
          )}
        </div>

        {/* Templates Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col space-y-4">
          <div className="flex justify-between items-center mb-6 relative">
            <h2 className="text-2xl font-semibold text-center text-blue-400 flex items-center">
              <Settings size={22} className="inline mr-2" />
              Saved Templates
            </h2>
            {/* Add New Template Button */}
            <button
              onClick={() => handleRedirect("/template-editor")}
              className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              <span className="flex items-center space-x-2">
                <Plus size={18} />
              </span>
            </button>
          </div>
          {templateList.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-400 italic mb-4">
                No Saved Templates Available!
              </p>
              <button
                onClick={() => handleRedirect("/template-editor")}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                <span className="flex items-center space-x-2">
                  <Plus size={18} />
                  <span>Create New Template</span>
                </span>
              </button>
            </div>
          ) : (
            <TemplateList
              templateList={templateList}
              handleRedirect={handleRedirect}
              handleDelete={handleDelete}
            />
          )}
        </div>

        {/* Lead Sources Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col space-y-4">
          <div className="flex justify-between items-center mb-6 relative">
            <h2 className="text-2xl flex items-center font-semibold text-center text-purple-400">
              <Users size={22} className="inline mr-2" />
              Saved Lead Sources
            </h2>
            {/* Add New Lead Source Button */}
            <button
              onClick={() => handleRedirect("/lead-sources")}
              className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              <span className="flex items-center space-x-2">
                <Plus size={18} />
              </span>
            </button>
          </div>
          {leadSourceList.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-400 italic mb-4">
                No Saved Lead Sources Available!
              </p>
              <button
                onClick={() => handleRedirect("/create-lead-source")}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                <span className="flex items-center space-x-2">
                  <Plus size={18} />
                  <span>Add New Lead Source</span>
                </span>
              </button>
            </div>
          ) : (
            <LeadSourceList
              leadSourceList={leadSourceList}
              handleRedirect={handleRedirect}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const HomePage = Layout(Home, {
  title: "Home",
  description:
    "Create/Manage your sequences with automated emails & timely tasks.",
});

export default HomePage;
