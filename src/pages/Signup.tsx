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
import { signUpApi } from "@/constants/config";
import { useAppDispatch } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import { signUpSchema } from "@/schema/authSchema";
import Title from "@/shared/Title";
import { setFormData } from "@/store/slices/formslice";
import { ApiError, ApiResponse } from "@/types/responses";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const Signup = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleSuccess = (message: string) => {
    toast({
      title: message,
      variant: "default",
      duration: 5000,
    });
  };

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post<ApiResponse>(signUpApi, data);

      if (response.status === 200) {
        handleSuccess(response.data.message);
        dispatch(setFormData({ name: data.name, email: data.email }));
        form.reset();
        navigate(`/verify/${response.data.data?._id}`);
      }
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      toast({
        title: err.response?.data.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Title
        title="Sign Up"
        description="Create/Manage your sequences with automated emails & timely tasks."
      />
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-xl p-8 space-y-8 rounded-xl border ">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
              Welcome to FlowMaker
            </h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 text-xl"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please enter your name"
                        {...field}
                        className="py-7 px-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please enter your email"
                        {...field}
                        className="py-7 px-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                        className="py-7 px-4 "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mx-auto px-4 py-2 flex flex-row items-center justify-center gap-1 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" /> Submit
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div>
            <p className="text-center">
              Already a member ?{" "}
              <a href="/signin" className="text-blue-500">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
