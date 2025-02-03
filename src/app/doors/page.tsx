"use client";

import { RSVPTable } from "./rsvp-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-blue-500">Electric Lounge Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-pink-500">Superlove RSVPs</CardTitle>
        </CardHeader>
        <CardContent>
          <RSVPTable />
        </CardContent>
      </Card>
    </div>
  );
}