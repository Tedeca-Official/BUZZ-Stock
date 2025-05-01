
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users as UsersIcon } from "lucide-react";

const Users = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-savvy-primary" />
              <CardTitle>User Management</CardTitle>
            </div>
            <CardDescription>
              Manage users and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              This is a demo version. User management functionality will be implemented in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;
