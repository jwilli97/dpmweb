import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
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
}

export function RSVPTable() {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const supabase = createClientComponentClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRSVPId, setSelectedRSVPId] = useState<number | null>(null)
  const [guestNames, setGuestNames] = useState<string[]>([''])

  const fetchRSVPs = async () => {
    const { data, error } = await supabase.from("superlove").select("*").order("id", { ascending: true })

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
        .from("superlove")
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
        .from("superlove")
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
            <TableHead className="w-[120px]">First Name</TableHead>
            <TableHead className="w-[120px]">Last Name</TableHead>
            <TableHead className="w-[180px]">Email</TableHead>
            <TableHead className="w-[80px] text-center">Guests</TableHead>
            <TableHead className="w-[100px]">Add Guests</TableHead>
            <TableHead className="w-[120px]">Payment</TableHead>
            <TableHead className="w-[120px]">Handle</TableHead>
            <TableHead className="w-[80px] text-center">Status</TableHead>
            <TableHead className="w-[120px]">Action</TableHead>
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
                  className="px-2 py-1 h-8 text-sm"
                >
                  Add Guest
                </Button>
              </TableCell>
              <TableCell>{rsvp.paymentOption}</TableCell>
              <TableCell className="text-sm">{rsvp.paymentHandle}</TableCell>
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
                  className="px-2 py-1 h-8 text-sm w-full"
                >
                  {rsvp.attended ? "Undo" : "Check-in"}
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