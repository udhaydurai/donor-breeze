
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-gray-50 p-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-7xl font-bold text-nonprofit-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            <ArrowLeft size={18} />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
