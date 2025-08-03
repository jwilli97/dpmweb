"use client";

import { RSVPTable } from "./rsvp-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">Electric Lounge Dashboard</h1>
      <Card className="overflow-hidden">
        <CardHeader className="py-4">
          <CardTitle className="text-center text-pink-500 text-xl">August 2025 RSVPs</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-2">
          <RSVPTable />
        </CardContent>
      </Card>
    </div>
  );
}