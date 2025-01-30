"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Move Supabase client creation outside the component
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RSVPForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    guests: 0,
    paymentOption: ""
  });

  // Add price constants
  const PRICES = {
    venmo: 20,
    cashapp: 20,
    cash: 25
  };

  // Calculate total attendees (including main person)
  const totalAttendees = formData.guests + 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check for existing email
      const { data: existingRSVP } = await supabase
        .from('superlove')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (existingRSVP) {
        alert('An RSVP with this email already exists');
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('superlove')
        .insert([formData]);
        
      if (error) throw error;
      
      // Redirect to confirmation page on success
      router.push('/confirmation');
    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
      alert('Failed to submit RSVP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/background1.jpeg')] bg-cover bg-center flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">SUPERLOVE - FEB 14, 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                required
                value={formData.firstname}
                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                required
                value={formData.lastname}
                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">Additional Guests</Label>
              <Select
                value={formData.guests.toString()}
                onValueChange={(value) => setFormData({...formData, guests: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number of guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Option</Label>
              <RadioGroup
                required
                value={formData.paymentOption}
                onValueChange={(value) => setFormData({...formData, paymentOption: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="venmo" id="venmo" />
                  <Label htmlFor="venmo">Venmo (${PRICES.venmo * totalAttendees})</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cashapp" id="cashapp" />
                  <Label htmlFor="cashapp">Cash App (${PRICES.cashapp * totalAttendees})</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash at Door (${PRICES.cash * totalAttendees})</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
