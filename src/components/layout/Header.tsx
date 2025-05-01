
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-2xl font-semibold text-savvy-primary">Stock Savvy</h1>
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="mr-3">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name} ({isAdmin ? "Admin" : "Worker"})
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="text-sm px-3 py-1"
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
