import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyOtpApi } from "@/constants/config";
import { useAppSelector } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import { useConfetti } from "@/hooks/useConfetti";
import { verifySchema } from "@/schema/authSchema";
import { ApiError, ApiResponse } from "@/types/responses";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const Verify = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { id } = useParams();
  const fireConfetti = useConfetti();
  const { name, email } = useAppSelector((state) => state.form);
  const navigate = useNavigate();

  if (name === "" || email === "" || !id) {
    navigate("/signup");
  }

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: "",
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

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsLoading(true);
      console.log(data);
      const response = await axios.post<ApiResponse>(`${verifyOtpApi}/${id}`, {
        otp: data.otp,
      });
      console.log(response);
      if (response.status === 200) {
        handleSuccess(response.data.message);
        form.reset();
        navigate("/signin");
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-xl p-8 space-y-8 rounded-xl border ">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Welcome to FlowMaker
          </h1>
          <p className="text-sm text-muted-foreground">
            {" "}
            Hey {name}, to complete your registration please enter the code sent
            to {email}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
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
                    <Loader2 className="animate-spin h-4 w-4" /> Verifying
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Verify;
