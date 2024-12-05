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
import { LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { flowList } = useAppSelector((state) => state.flow);
  const { templateList } = useAppSelector((state) => state.template);
  const { leadSourceList } = useAppSelector((state) => state.list);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <HomeShimmer />;
  }

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
        <div className="bg-gray-800 rounded shadow-lg p-8 flex flex-col">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Saved Flows
          </h2>
          {flowList.length === 0 ? (
            <p className="text-gray-400 italic text-center">
              No Saved Flows Available!
            </p>
          ) : (
            <FlowList
              flowList={flowList}
              handleRedirect={handleRedirect}
              handleDelete={handleDelete}
            />
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
            <TemplateList
              templateList={templateList}
              handleRedirect={handleRedirect}
              handleDelete={handleDelete}
            />
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
