import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeShimmer } from "./Layouts/Loaders";
import ProtectedRoutes from "./auth/ProtectedRoutes";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "./types/responses";
import { getUserProfileApi } from "./constants/config";
import { setProfile, setUserExists } from "./store/slices/authSlice";
import { useToast } from "./hooks/use-toast";
import { ReactFlowProvider } from "@xyflow/react";
import { setFlowList } from "./store/slices/flowChartSlice";
import { setTemplateList } from "./store/slices/templateSlice";
import { setList } from "./store/slices/listSlice";

const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const Verify = lazy(() => import("./pages/Verify"));
const HomePage = lazy(() => import("./pages/Home"));
const Flowchart = lazy(() => import("./pages/Flowchart"));
const TemplateEditor = lazy(() => import("./pages/TemplateEditor"));
const CSVPage = lazy(() => import("./pages/CsvUpload"));
const DataPreview = lazy(() => import("./pages/DataPreview"));
const PreviewSeqPage = lazy(() => import("./pages/PreviewSeq"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

const App = () => {
  const { loader, userExists } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get<ApiResponse>(getUserProfileApi, {
          withCredentials: true,
        });

        dispatch(setProfile(response.data.data?.user));
        dispatch(setFlowList(response.data.data?.flows));
        dispatch(setTemplateList(response.data.data?.templates));
        dispatch(setList(response.data.data?.leads));
        toast({
          title: `Welcome ${response.data.data?.user?.name}`,
          variant: "default",
        });
      } catch (error) {
        const err = error as AxiosError<ApiError>;
        dispatch(setUserExists(false));
        toast({
          title: err.response?.data.message || "Please login again to continue",
          variant: "destructive",
        });
      }
    }
    fetchProfile();
  }, [dispatch, toast, userExists]);

  return loader ? (
    <HomeShimmer />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<HomeShimmer />}>
        <Routes>
          <Route element={<ProtectedRoutes userExists={userExists} />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/flowchart"
              element={
                <ReactFlowProvider>
                  <Flowchart />
                </ReactFlowProvider>
              }
            />
            <Route
              path="/flowchart/:id"
              element={
                <ReactFlowProvider>
                  <PreviewSeqPage />
                </ReactFlowProvider>
              }
            />
            <Route path="/template-editor" element={<TemplateEditor />} />
            <Route path="/template-editor/:id" element={<TemplateEditor />} />
            <Route path="/lead-sources" element={<CSVPage />} />
            <Route path="/lead-sources/:id" element={<DataPreview />} />
          </Route>
          <Route
            element={<ProtectedRoutes userExists={!userExists} redirect="/" />}
          >
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify/:id" element={<Verify />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
