
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as ChartIcon } from "lucide-react";

const Analytics = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ChartIcon className="h-5 w-5 text-savvy-primary" />
              <CardTitle>Sales Analytics</CardTitle>
            </div>
            <CardDescription>
              View detailed analytics and reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              This is a demo version. Analytics functionality will be implemented in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
