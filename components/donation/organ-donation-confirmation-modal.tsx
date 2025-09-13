"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { Heart, Users } from "lucide-react"

interface OrganDonationConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  organsToDonate: string[]
  date?: Date
  location: string
}

export function OrganDonationConfirmationModal({
  isOpen,
  onClose,
  onComplete,
  organsToDonate,
  date,
  location,
}: OrganDonationConfirmationModalProps) {
  // Calculate potential impact based on organs selected
  const getImpact = () => {
    const impactMap: Record<string, number> = {
      "heart": 1,
      "liver": 1,
      "kidneys": 2,
      "lungs": 2,
      "pancreas": 1,
      "intestines": 1,
      "corneas": 2,
      "skin": 1,
      "bone": 1,
      "tendons": 1,
    }

    return organsToDonate.reduce((total, organ) => {
      return total + (impactMap[organ] || 1)
    }, 0)
  }

  const getOrganDisplayName = (organ: string) => {
    const displayNames: Record<string, string> = {
      "heart": "Heart",
      "liver": "Liver", 
      "kidneys": "Kidneys",
      "lungs": "Lungs",
      "pancreas": "Pancreas",
      "intestines": "Intestines",
      "corneas": "Corneas",
      "skin": "Skin",
      "bone": "Bone",
      "tendons": "Tendons",
    }
    return displayNames[organ] || organ
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Thank You for Registering!
          </DialogTitle>
          <DialogDescription>
            Your organ donation registration has been submitted. Here&apos;s a summary of your registration details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <div className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
              <Users className="h-8 w-8" />
              {getImpact()}
            </div>
            <p className="text-sm text-gray-600">
              Your donation could potentially save or improve <strong>{getImpact()} lives</strong>!
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Organs to Donate:</span>
              <span className="text-right max-w-[200px]">
                {organsToDonate.map(getOrganDisplayName).join(", ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Registration Date:</span>
              <span>{date ? format(date, "PPP") : "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Location:</span>
              <span className="text-right max-w-[200px]">{location}</span>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="font-medium mb-2">Important Next Steps:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Keep your registration card with you</li>
              <li>Inform your family about your decision</li>
              <li>Update your driver&apos;s license if applicable</li>
              <li>Review and update your registration annually</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-3 rounded-md text-sm">
            <p className="font-medium text-blue-800 mb-1">Remember:</p>
            <p className="text-blue-700">
              Organ donation only occurs after brain death is confirmed by medical professionals. 
              Your organs will be evaluated for suitability at that time.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Edit Details
          </Button>
          <Button type="button" onClick={onComplete}>
            Confirm Registration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
