"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";

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
    paymentOption: "",
    paymentHandle: ""
  });

  // Add price constants
  const PRICES = {
    venmo: 20,
    cashapp: 20
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
      <Card className="w-full max-w-2xl bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center">
            S U P E R L O V E
            <div className="text-xl mt-1 font-normal">February 14, 2025 • North ATX</div>
          </CardTitle>
          <CardDescription className="text-center text-gray-800 whitespace-pre-line mt-4">
            {`Schedule:
            7:00 PM - Doors Open
            8:00 PM - Glossolalia Online
            9:00 PM - Cherelle K & b. spoke
            10:00 PM - Chucky Blk

            Your ticket includes:
            • Food and drink voucher
            • Full evening of performances
            • Venue location & details (sent after purchase)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center w-full mb-6 px-12">
            <Carousel className="w-full max-w-xl">
              <CarouselContent>
                <CarouselItem>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-[16/9] items-center justify-center p-0 relative">
                        <Image 
                          src="/SuperlovePoster.jpg" 
                          alt="Superlove Poster"
                          className="object-cover rounded-lg"
                          fill
                          priority
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-[16/9] items-center justify-center p-0 relative">
                        <Image 
                          src="/PinkPoster.jpeg" 
                          alt="Pink Poster"
                          className="object-cover rounded-lg"
                          fill
                          priority
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-lg font-semibold">First Name</Label>
              <Input
                id="firstname"
                required
                value={formData.firstname}
                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-lg font-semibold">Last Name</Label>
              <Input
                id="lastname"
                required
                value={formData.lastname}
                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg font-semibold">Email (where we'll send your ticket)</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests" className="text-lg font-semibold">Additional Guests</Label>
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
              <Label className="text-lg font-semibold">Payment Option</Label>
              <RadioGroup
                required
                value={formData.paymentOption}
                onValueChange={(value) => setFormData({...formData, paymentOption: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="venmo" id="venmo" />
                  <Label htmlFor="venmo" className="">Venmo (${PRICES.venmo * totalAttendees})</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cashapp" id="cashapp" />
                  <Label htmlFor="cashapp" className="">Cash App (${PRICES.cashapp * totalAttendees})</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">Payment Handle</Label>
              <Input
                id="paymentHandle"
                required
                value={formData.paymentHandle}
                onChange={(e) => setFormData({...formData, paymentHandle: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <p className="text-md text-center text-gray-800">Once we receive your payment via CashApp or Venmo, you will receive a confirmation email with your ticket details. <br /> Payments can be made to <strong>digitalparadisemedia</strong> on CashApp and Venmo.</p>
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