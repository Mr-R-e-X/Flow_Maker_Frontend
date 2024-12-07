import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-9xl font-extrabold tracking-tight animate-pulse">
          404
        </h1>
        <p className="mt-4 text-2xl sm:text-3xl font-semibold">
          Oops! Page not found.
        </p>
        <p className="mt-2 text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-8 py-3 text-lg font-medium text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-transform transform hover:scale-105 focus:ring focus:ring-yellow-400 focus:ring-opacity-50 shadow-lg"
        >
          Back to Home
        </Link>
        <div className="relative mt-10">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500 rounded-full filter blur-xl opacity-40 animate-spin-slow"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full filter blur-xl opacity-40 animate-spin-reverse"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
