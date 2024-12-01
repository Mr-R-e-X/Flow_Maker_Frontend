import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { signInSchema } from "@/schema/authSchema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { signInApi } from "@/constants/config";
import { Loader2 } from "lucide-react";
import { useConfetti } from "@/hooks/useConfetti";
import { ApiError, ApiResponse } from "@/types/responses";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/hooks";
import { login } from "@/store/slices/authSlice";

const Signin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const fireConfetti = useConfetti();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSuccess = (message: string) => {
    fireConfetti();
    toast({
      title: message,
      variant: "default",
      duration: 5000,
    });
  };

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post<ApiResponse>(signInApi, data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        handleSuccess(response.data.message);
        form.reset();
        dispatch(login());
        navigate("/");
      }
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      console.log(error);
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-xl p-8 space-y-8 rounded-xl border ">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Welcome to FlowMaker
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
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
                      className="py-7 px-4"
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
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
