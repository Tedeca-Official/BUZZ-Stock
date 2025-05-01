
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-savvy-primary" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>
              Configure general application settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              This is a demo version. Settings functionality will be implemented in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
