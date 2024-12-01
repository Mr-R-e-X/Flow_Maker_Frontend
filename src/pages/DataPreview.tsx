/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPaginatedData } from "@/constants/config";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/Layouts/Layout";
import { ApiError, ApiResponse } from "@/types/responses";
import axios, { AxiosError } from "axios";
import { LoaderPinwheel } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

type CsvRow = { [key: string]: string };

const DataPreview = () => {
  const [editableData, setEditableData] = useState<CsvRow[]>([]);
  const [isParsingData, setIsParsingData] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const maxPage = useRef(1);
  const { toast } = useToast();
  const { id } = useParams();

  const fecthData = async (val: number) => {
    if (isParsingData) return;
    setIsParsingData(true);
    if (val > 0) {
      setPage(val);
    }
    if (val < 0) return;
    console.log(page);
    try {
      const response = await axios.get<ApiResponse>(
        `${getPaginatedData}/${id}?page=${page}`,
        {
          withCredentials: true,
        }
      );
      setEditableData(response.data.data?.data);
      maxPage.current = response.data.data?.totalPages;
      toast({
        title: response.data.message,
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
      setIsParsingData(false);
    }
  };

  useEffect(() => {
    fecthData(1);
  }, []);

  return (
    <div className="h-[calc(100vh-6rem)] bg-gradient-to-b from-gray-900 to-black text-white p-8 flex flex-col items-center">
      <div className="w-full flex flex-col justify-center items-center px-4">
        {isParsingData && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <LoaderPinwheel className="animate-spin text-green-300" size={64} />
          </div>
        )}

        <div className="mt-2 w-full">
          {editableData.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Preview of the CSV File
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-700">
                  <thead>
                    <tr className="bg-gray-800">
                      {Object.keys(editableData[0]).map((header, index) => (
                        <th
                          key={index}
                          className="border border-gray-700 px-4 py-2 text-left min-w-max"
                        >
                          <div className="flex items-center justify-between gap-2 w-full">
                            <span className="text-nowrap">{header}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {editableData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.keys(row).map((columnKey, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="border border-gray-700 px-4 py-2 min-w-max"
                          >
                            <p>{row[columnKey]}</p>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination>
                <PaginationContent className="my-4">
                  <PaginationItem>
                    <PaginationPrevious
                      isActive={!isParsingData && page > 1}
                      onClick={() => page > 1 && fecthData(page - 1)}
                      className={`cursor-pointer text-lg ${
                        (isParsingData || page === 1) &&
                        "opacity-50 cursor-not-allowed"
                      }`}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>{page}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      isActive={!isParsingData && page <= maxPage.current}
                      onClick={() =>
                        page < maxPage.current && fecthData(page + 1)
                      }
                      className={`cursor-pointer text-lg ${
                        (isParsingData || page === maxPage.current) &&
                        "opacity-50 cursor-not-allowed"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MemoizedDataPreview = memo(DataPreview);

const DataPreviewPage = Layout(MemoizedDataPreview);

export default DataPreviewPage;
