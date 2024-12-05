import { Skeleton } from "@/components/ui/skeleton";

export const HomeShimmer = () => {
  return (
    <div className="h-[calc(100vh-6rem)] bg-gradient-to-b from-gray-900 to-black text-white p-8 flex flex-col items-center">
      <Skeleton className="w-3/4 h-16 mb-12 bg-gray-700" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
        <div className="bg-gray-800 rounded shadow-lg p-8 flex flex-col">
          <Skeleton className="h-8 w-1/2 mb-6 bg-gray-700 mx-auto" />
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-12 w-full bg-gray-700 rounded"
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded shadow-lg p-8 flex flex-col">
          <Skeleton className="h-8 w-1/2 mb-6 bg-gray-700 mx-auto" />
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-12 w-full bg-gray-700 rounded"
              />
            ))}
          </div>
        </div>

        {/* Saved Lead Sources Section Skeleton */}
        <div className="bg-gray-800 rounded shadow-lg p-8 flex flex-col">
          <Skeleton className="h-8 w-1/2 mb-6 bg-gray-700 mx-auto" />
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-12 w-full bg-gray-700 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
