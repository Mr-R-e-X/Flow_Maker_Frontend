/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { uploadCSV } from "@/constants/config";
import { useAppDispatch } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";
import Layout from "@/Layouts/Layout";
import { uploadLeadsSchema } from "@/schema/authSchema";
import { setCurrentList } from "@/store/slices/listSlice";
import { ApiError, ApiResponse } from "@/types/responses";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { LoaderIcon, LoaderPinwheel } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

type CsvRow = { [key: string]: string };

const CsvUpload: React.FC = () => {
  const [editableData, setEditableData] = useState<CsvRow[]>([]);
  const [isParsingData, setIsParsingData] = useState<boolean>(false);
  const navigate = useNavigate();

  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof uploadLeadsSchema>>({
    resolver: zodResolver(uploadLeadsSchema),
    defaultValues: {
      name: "",
      CSV_LEAD: undefined,
    },
  });

  const handleSuccess = useConfetti();

  const onSubmit = async (data: z.infer<typeof uploadLeadsSchema>) => {
    try {
      setIsParsingData(true);
      const response = await axios.post<ApiResponse>(uploadCSV, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      setEditableData(response.data.data?.paginatedData?.data);
      dispatch(setCurrentList(response.data.data?.source));
      toast({
        title: response.data.message || "CSV file uploaded successfully",
        variant: "default",
        duration: 5000,
      });

      handleSuccess();
      navigate("/");
    } catch (error: any) {
      const err = error as AxiosError<ApiError>;
      toast({
        title: err.response?.data.message || "Something went wrong !!",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsParsingData(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] bg-gradient-to-b from-gray-900 to-black text-white p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl flex flex-col justify-center items-center px-6 py-12 bg-gray-800 rounded-xl shadow-lg">
        {editableData.length === 0 && (
          <div className="w-full">
            <h1 className="text-3xl font-semibold text-center text-white mb-8">
              Upload a Lead Source CSV File
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mb-6 flex flex-col space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-gray-200">
                        Name of the Lead List
                      </FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          placeholder="Enter the name of the Lead"
                          {...field}
                          className="mt-2 px-4 py-3 bg-gray-700 text-lg text-gray-200 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="CSV_LEAD"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-gray-200">
                        Upload CSV File
                      </FormLabel>
                      <FormControl>
                        <input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          className="file:px-4 file:cursor-pointer file:py-3 file:border-0 file:rounded-lg file:bg-gray-700 file:text-gray-200 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full flex items-center justify-center">
                  <Button
                    type="submit"
                    disabled={isParsingData}
                    className="mt-4 text-lg font-semibold w-full py-3 px-6 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    {isParsingData ? (
                      <LoaderIcon className="animate-spin text-white" />
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {isParsingData && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <LoaderPinwheel className="animate-spin text-green-300" size={64} />
          </div>
        )}
      </div>
    </div>
  );
};

const CSVpage = Layout(CsvUpload, {
  title: "CSV Upload",
  description: "Upload a CSV file to create a new lead list",
});

export default CSVpage;
