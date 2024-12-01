import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logOutApi } from "@/constants/config";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import { logout } from "@/store/slices/authSlice";
import { ApiError, ApiResponse } from "@/types/responses";

import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import axios, { AxiosError } from "axios";

import {
  List,
  LoaderPinwheel,
  LogOutIcon,
  LucideLayoutTemplate,
  PlusSquare,
  SendToBack,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const handleRedirect = (urlStr: string) => {
    // if (urlStr === "flowchart") {
    //   dispatch(resetFlowList());
    //   dispatch(resetEdges());
    //   dispatch(resetNodes());
    // }
    navigate(urlStr);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<ApiResponse>(logOutApi, {
        withCredentials: true,
      });
      toast({
        title: response.data.message,
        variant: "destructive",
        duration: 5000,
      });
      dispatch(logout());
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
    <div>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <LoaderPinwheel className="animate-spin text-green-300" size={64} />
        </div>
      )}
      <div className="hidden w-full max-h-max lg:flex justify-between py-6 px-6 items-center border-b bg-black">
        <div className="max-w-max cursor-pointer">
          <h1
            className="text-3xl tracking-tighter font-bold italic cursor-pointer"
            onClick={() => handleRedirect("/")}
          >
            <span className="text-blue-600">Flow</span>
            <span className="text-gray-600">Maker</span>
          </h1>
        </div>
        <div className="flex flex-row justify-end items-center gap-10">
          <div className="flex flex-row cursor-pointer font-semibold text-lg">
            <Popover>
              <PopoverTrigger asChild>
                <PlusSquare className="min-h-8 min-w-8" />
              </PopoverTrigger>
              <PopoverContent className="max-w-max p-4">
                <div className="flex flex-col gap-2">
                  <Button
                    variant={"outline"}
                    onClick={() => handleRedirect(`/lead-sources`)}
                    className="flex flex-row gap-2 justify-start text-lg"
                  >
                    {" "}
                    <List size={30} className="text-blue-400 mt-1" />{" "}
                    <span>Upload New List</span>
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => handleRedirect(`/flowchart`)}
                    className="flex flex-row gap-2 justify-start text-lg"
                  >
                    {" "}
                    <SendToBack size={30} className="text-blue-400 mt-1" />{" "}
                    <span>Create New Sequence</span>
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => handleRedirect(`/template-editor`)}
                    className="flex flex-row gap-2 justify-start text-lg"
                  >
                    {" "}
                    <LucideLayoutTemplate
                      size={30}
                      className="text-blue-400 mt-1"
                    />{" "}
                    <span>Create New Template</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-row cursor-pointer font-semibold text-lg">
            <Popover>
              <PopoverTrigger>
                <User className="text-blue-400 min-h-8 min-w-8" />
              </PopoverTrigger>
              <PopoverContent className="max-w-max p-4">
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg">
                    Hello,{" "}
                    <span className="font-semibold text-blue-500">
                      {user?.name}
                    </span>
                  </h4>
                  <Button
                    variant={"outline"}
                    onClick={handleLogout}
                    className="flex flex-row gap-2 justify-start text-lg"
                  >
                    {" "}
                    <LogOutIcon size={30} className="text-red-400 mt-1" />{" "}
                    <span className="text-red-600">Log Out </span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex w-full max-h-max lg:hidden justify-between py-6 px-6 items-center border-b backdrop-blur-md">
        <div className="max-w-max cursor-pointer">
          <h1 className="text-2xl md:text-3xl tracking-tighter font-bold italic">
            <span className="text-blue-600">Flow</span>
            <span className="text-gray-600">Maker</span>
          </h1>
        </div>
        <Sheet>
          <SheetTrigger asChild className="">
            <List className="h-7 w-7 cursor-pointer" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <p
                  className="text-3xl tracking-tighter font-bold italic cursor-pointer"
                  onClick={() => handleRedirect("/")}
                >
                  <span className="text-blue-600">Flow</span>
                  <span className="text-gray-600">Maker</span>
                </p>
              </SheetTitle>
              <SheetDescription>
                Create/Manage your sequences with automated emails & timely
                tasks.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="mb-1 cursor-pointer">
                <Button
                  variant={"outline"}
                  className="font-semibold w-full flex justify-start items-center text-lg py-2 h-max"
                  onClick={() => handleRedirect(`/lead-sources`)}
                >
                  <List className="text-blue-400" />{" "}
                  <span>Create New List</span>
                </Button>
              </div>
              <div className="mb-1 cursor-pointer">
                <Button
                  variant={"outline"}
                  className="font-semibold w-full flex justify-start items-center text-lg py-2 h-max"
                  onClick={() => handleRedirect(`/flowchart`)}
                >
                  <SendToBack className="text-blue-400" />{" "}
                  <span>Create New Sequence</span>
                </Button>
              </div>
              <div className="mb-1 cursor-pointer">
                <Button
                  variant={"outline"}
                  className="font-semibold w-full flex justify-start items-center text-lg py-2 h-max"
                  onClick={() => handleRedirect(`/template-editor`)}
                >
                  <LucideLayoutTemplate className="text-blue-400" />{" "}
                  <span>Create New Template</span>
                </Button>
              </div>
              <div className="mb-1 cursor-pointer">
                <Button
                  variant={"outline"}
                  className="font-semibold w-full flex justify-start items-center text-lg py-2 h-max"
                  onClick={handleLogout}
                >
                  <LogOutIcon className="text-red-400" />{" "}
                  <span className="text-red-500">Log Out</span>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Header;
