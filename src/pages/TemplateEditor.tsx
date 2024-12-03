import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { templateApi } from "@/constants/config";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";
import Layout from "@/Layouts/Layout";
import { emailTemplateSchema } from "@/schema/authSchema";
import { ApiError, ApiResponse } from "@/types/responses";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const TemplateEditor = () => {
  const { toast } = useToast();
  const [isloading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm<z.infer<typeof emailTemplateSchema>>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      name: "",
      subject: "",
      body: "",
    },
  });
  const confetti = useConfetti();
  const handleSuccess = () => confetti();

  useEffect(() => {
    if (isloading || !id) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ApiResponse>(`${templateApi}/${id}`, {
          withCredentials: true,
        });
        form.reset({
          name: response.data.data?.name || "",
          subject: response.data.data?.subject || "",
          body: response.data.data?.body || "",
        });
        console.log(response);
        toast({
          title: response.data.message,
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
    fetchData();
  }, []);

  const onSubmit = async (data: z.infer<typeof emailTemplateSchema>) => {
    try {
      setIsLoading(true);
      let response;
      if (!id) {
        response = await axios.post<ApiResponse>(templateApi, data, {
          withCredentials: true,
        });
      } else {
        response = await axios.patch<ApiResponse>(
          `${templateApi}/${id}`,
          data,
          {
            withCredentials: true,
          }
        );
      }
      toast({
        title: response.data.message || "Template saved successfully",
        variant: "default",
        duration: 5000,
      });
      handleSuccess();
      navigate("/");
    } catch (error: unknown) {
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

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6] }],
      [
        {
          size: ["small", "normal", "large", "huge"],
        },
      ],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black justify-center items-center w-full h-[calc(100vh-10rem)] p-6">
      {isloading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <LoaderPinwheel className="animate-spin text-green-300" size={64} />
        </div>
      )}
      <div className="text-center my-5">
        <h1 className="text-2xl font-bold text-white">Template Editor</h1>
        <p className="text-gray-200 text-lg">
          Create/Edit email template to add it to Sequences.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-4xl bg-gray-900 shadow-md rounded-lg p-6 space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel
                  htmlFor="template-name"
                  className="text-lg font-semibold"
                >
                  Template Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Enter Template Name"
                    className="w-full text-xl font-bold px-4 py-6 border rounded-md text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel
                  htmlFor="email-subject"
                  className="text-lg font-semibold"
                >
                  Email Subject
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter Email Subject"
                    className="w-full text-xl font-bold px-4 py-6 border rounded-md text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-lg font-semibold">
                  Email Content
                </FormLabel>
                <FormControl>
                  <ReactQuill
                    {...field}
                    modules={modules}
                    placeholder="Write email content here..."
                    className="h-72 overflow-y-hidden bg-slate-50 text-black"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Save as Template
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const TemplateEditorPage = Layout(TemplateEditor, {
  title: "Template Editor",
  description: "Create/Edit email template to add it to Sequences.",
});

export default TemplateEditorPage;
