"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[url('/background1.jpeg')] bg-cover bg-center flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Thank You!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center">
            Your RSVP has been successfully submitted for the next Electric Lounge show!
            We look forward to seeing you on August 16, 2025!
          </p>
          <p className="text-center">
            Once we receive your payment, you will receive a confirmation email with your ticket(s).
          </p>
          <Button 
            className="w-full" 
            onClick={() => router.push('/')}
          >
            Return Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}