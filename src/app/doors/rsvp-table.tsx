'use client';

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Mail, MailCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface RSVP {
  id: number
  firstname: string
  lastname: string
  email: string
  guests: number
  paymentOption: string
  paymentHandle: string
  attended: boolean
  tickets_sent: boolean
}

export function RSVPTable() {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const supabase = createClientComponentClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRSVPId, setSelectedRSVPId] = useState<number | null>(null)
  const [guestNames, setGuestNames] = useState<string[]>([''])
  const [sendingEmail, setSendingEmail] = useState<number | null>(null)

  const fetchRSVPs = async () => {
    const { data, error } = await supabase.from("september2025").select("*").order("id", { ascending: true })

    if (error) {
      console.error("Error fetching RSVPs:", error)
      return
    }
    
    setRsvps(data || [])
  }

  const handleCheckIn = async (id: number, attended: boolean) => {
    try {
      console.log('Attempting check-in for ID:', id, 'Current attended status:', attended)
      
      const { error } = await supabase
        .from("september2025")
        .update({ attended: !attended })
        .eq("id", id)

      if (error) {
        console.error("Supabase update error:", error)
        throw error
      }

      console.log('Check-in successful, fetching updated data...')
      await fetchRSVPs()
    } catch (error) {
      console.error("Error updating attendance:", error)
    }
  }

  const handleSendTicket = async (rsvp: RSVP) => {
    setSendingEmail(rsvp.id)
    
    try {
      // First, mark tickets as sent in the database
      const { error: dbError } = await supabase
        .from("september2025")
        .update({ tickets_sent: true })
        .eq("id", rsvp.id)

      if (dbError) {
        console.error("Error updating tickets_sent status:", dbError)
        return
      }

      // Refresh the table to show updated status immediately
      await fetchRSVPs()

      // Then send the email
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: rsvp.firstname,
          lastName: rsvp.lastname,
          email: rsvp.email,
          guests: rsvp.guests,
          paymentOption: rsvp.paymentOption,
          paymentHandle: rsvp.paymentHandle,
          source: 'doors',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Failed to send email:', result)
        // Email failed, but we keep the tickets_sent as true since user attempted to send
      }
    } catch (error) {
      console.error('Error sending ticket:', error)
    } finally {
      setSendingEmail(null)
    }
  }

  const handleAddGuest = (id: number) => {
    setSelectedRSVPId(id)
    setGuestNames([''])
    setIsDialogOpen(true)
  }

  const addGuestNameField = () => {
    if (guestNames.length < 5) {
      setGuestNames([...guestNames, ''])
    }
  }

  const updateGuestName = (index: number, value: string) => {
    const newGuestNames = [...guestNames]
    newGuestNames[index] = value
    setGuestNames(newGuestNames)
  }

  const handleSubmitGuests = async () => {
    if (!selectedRSVPId) return

    try {
      const filteredNames = guestNames.filter(name => name.trim() !== '')
      const { error } = await supabase
        .from("september2025")
        .update({ 
          additional_guests: filteredNames 
        })
        .eq("id", selectedRSVPId)

      if (error) throw error
      
      await fetchRSVPs()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error adding guests:", error)
    }
  }

  useEffect(() => {
    fetchRSVPs()
  }, [supabase])

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[90px]">First Name</TableHead>
            <TableHead className="w-[90px]">Last Name</TableHead>
            <TableHead className="w-[140px]">Email</TableHead>
            <TableHead className="w-[50px] text-center">Guests</TableHead>
            <TableHead className="w-[70px]">Add Guests</TableHead>
            <TableHead className="w-[70px]">Payment</TableHead>
            <TableHead className="w-[90px]">Handle</TableHead>
            <TableHead className="w-[50px] text-center">Attended</TableHead>
            <TableHead className="w-[70px]">Check-in</TableHead>
            <TableHead className="w-[60px] text-center">Tickets Sent</TableHead>
            <TableHead className="w-[90px]">Send Ticket</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rsvps.map((rsvp) => (
            <TableRow key={rsvp.id}>
              <TableCell className="font-medium">{rsvp.firstname}</TableCell>
              <TableCell>{rsvp.lastname}</TableCell>
              <TableCell className="text-sm">{rsvp.email}</TableCell>
              <TableCell className="text-center">{rsvp.guests}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => handleAddGuest(rsvp.id)}
                  className="px-2 py-1 h-8 text-xs"
                >
                  Add Guest
                </Button>
              </TableCell>
              <TableCell className="text-sm">{rsvp.paymentOption}</TableCell>
              <TableCell className="text-xs">{rsvp.paymentHandle}</TableCell>
              <TableCell className="text-center">
                {rsvp.attended ? 
                  <CheckCircle className="text-green-500 inline-block h-5 w-5" /> : 
                  <XCircle className="text-red-500 inline-block h-5 w-5" />
                }
              </TableCell>
              <TableCell>
                <Button
                  variant={rsvp.attended ? "outline" : "default"}
                  onClick={() => handleCheckIn(rsvp.id, rsvp.attended)}
                  className="px-2 py-1 h-8 text-xs w-full"
                >
                  {rsvp.attended ? "Undo" : "Check-in"}
                </Button>
              </TableCell>
              <TableCell className="text-center">
                {rsvp.tickets_sent ? 
                  <MailCheck className="text-green-500 inline-block h-5 w-5" /> : 
                  <Mail className="text-gray-400 inline-block h-5 w-5" />
                }
              </TableCell>
              <TableCell>
                <Button
                  variant={rsvp.tickets_sent ? "outline" : "secondary"}
                  onClick={() => handleSendTicket(rsvp)}
                  disabled={sendingEmail === rsvp.id}
                  className="px-2 py-1 h-8 text-xs w-full flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" />
                  {sendingEmail === rsvp.id ? "Sending..." : rsvp.tickets_sent ? "Resend" : "Send Ticket"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Guest Names (Max 5)</DialogTitle>
          </DialogHeader>
          
          {guestNames.map((name, index) => (
            <Input
              key={index}
              placeholder={`Guest ${index + 1} name`}
              value={name}
              onChange={(e) => updateGuestName(index, e.target.value)}
            />
          ))}
          
          {guestNames.length < 5 && (
            <Button variant="outline" onClick={addGuestNameField}>
              Add Another Guest
            </Button>
          )}

          <DialogFooter>
            <Button onClick={handleSubmitGuests}>Save Guests</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}