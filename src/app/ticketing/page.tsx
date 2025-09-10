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
import { z } from "zod";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Zod schema for form validation
const formSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  guests: z.number().min(0, "Number of guests cannot be negative"),
  paymentOption: z.string().min(1, "Please select a payment option"),
  paymentHandle: z.string().min(1, "Payment handle is required")
});

type FormData = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function RSVPForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    guests: 0,
    paymentOption: "",
    paymentHandle: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});

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
    setErrors({});
    
    try {
      // Validate form data with Zod
      const validatedData = formSchema.parse(formData);

      // Check for existing email
      const { data: existingRSVP } = await supabase
        .from('september2025')
        .select('email')
        .eq('email', validatedData.email)
        .maybeSingle();

      if (existingRSVP) {
        setErrors({ email: 'An RSVP with this email already exists' });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('september2025')
        .insert([validatedData]);
        
      if (error) throw error;
      
      // Redirect to confirmation page on success
      router.push('/confirmation');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const fieldErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Error submitting RSVP:', error);
        setErrors({ email: 'Failed to submit RSVP. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/background1.jpeg')] bg-cover bg-center flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center">
            Electric Lounge
            <div className="text-xl mt-1 font-normal">September 19, 2025 • North ATX</div>
          </CardTitle>
          <CardDescription className="text-center text-gray-800 whitespace-pre-line mt-4">
            {`Schedule:
            7:00 PM - Doors Open
            8:00 PM - Sam Cooper
            9:00 PM - Midnight Navy
            10:00 PM - Maru Haru

            Your ticket includes:
            • Food and drink voucher
            • Full evening of performances
            • Venue location & details (sent after purchase)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center w-full mb-6 px-12">
            {/* <Carousel className="w-full max-w-xl">
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
            </Carousel> */}
              <Image src="/sept2025.jpeg" alt="September Poster" width={1000} height={1000} />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-lg font-semibold">First Name</Label>
              <Input
                id="firstname"
                required
                value={formData.firstname}
                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                className={errors.firstname ? "border-red-500" : ""}
              />
              {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-lg font-semibold">Last Name</Label>
              <Input
                id="lastname"
                required
                value={formData.lastname}
                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                className={errors.lastname ? "border-red-500" : ""}
              />
              {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg font-semibold">Email (where we'll send your ticket)</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests" className="text-lg font-semibold">Additional Tickets</Label>
              <p className="text-sm text-gray-800 mb-2">Your ticket is included by default. Select how many additional tickets you'd like to purchase.</p>
              <Select
                value={formData.guests.toString()}
                onValueChange={(value) => setFormData({...formData, guests: parseInt(value)})}
              >
                <SelectTrigger className={errors.guests ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select number of additional tickets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No additional tickets</SelectItem>
                  <SelectItem value="1">1 additional ticket</SelectItem>
                  <SelectItem value="2">2 additional tickets</SelectItem>
                  <SelectItem value="3">3 additional tickets</SelectItem>
                  <SelectItem value="4">4 additional tickets</SelectItem>
                  <SelectItem value="5">5 additional tickets</SelectItem>
                </SelectContent>
              </Select>
              {errors.guests && <p className="text-red-500 text-sm">{errors.guests}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">Payment Option</Label>
              <p className="text-sm text-gray-800">Payments can be made to <strong>digitalparadisemedia</strong> on CashApp and Venmo.</p>
              <RadioGroup
                required
                value={formData.paymentOption}
                onValueChange={(value) => setFormData({...formData, paymentOption: value})}
                className={errors.paymentOption ? "border border-red-500 rounded p-2" : ""}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="venmo" id="venmo" />
                  <Label htmlFor="venmo" className="">Venmo (${PRICES.venmo * totalAttendees}) - @digitalparadisemedia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cashapp" id="cashapp" />
                  <Label htmlFor="cashapp" className="">Cash App (${PRICES.cashapp * totalAttendees}) - $digitalparadisemedia</Label>
                </div>
              </RadioGroup>
              {errors.paymentOption && <p className="text-red-500 text-sm">{errors.paymentOption}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">Payment Handle</Label>
              <Input
                id="paymentHandle"
                required
                value={formData.paymentHandle}
                onChange={(e) => setFormData({...formData, paymentHandle: e.target.value})}
                className={errors.paymentHandle ? "border-red-500" : ""}
              />
              {errors.paymentHandle && <p className="text-red-500 text-sm">{errors.paymentHandle}</p>}
            </div>

            <div className="space-y-2">
              <p className="text-md text-center text-gray-800">Once we receive your payment via CashApp or Venmo, you will receive a confirmation email with your ticket details. <br /> </p>
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