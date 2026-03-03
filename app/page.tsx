"use client"

import { useEffect, useState } from "react"
import { TimeSlot } from "@/lib/store"
import { TimeSlotCard } from "@/components/time-slot"
import { ReservationModal } from "@/components/reservation-modal"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [slots, setSlots] = useState<(TimeSlot & { reservationCount: number })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<(TimeSlot & { reservationCount: number }) | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchSlots = async () => {
    try {
      const res = await fetch("/api/reservations")
      const data = await res.json()
      setSlots(data.slots || [])
    } catch (error) {
      console.error("Failed to fetch slots:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [])

  const handleSlotClick = (slot: TimeSlot & { reservationCount: number }) => {
    setSelectedSlot(slot)
    setIsModalOpen(true)
  }

  const handleReservationSuccess = () => {
    fetchSlots() // Refresh slots to update counts
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
        {/* Header Section */}
        <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            CrossTarget Day
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            2026년 3월 11일 마이크로 세션 예약
          </p>
          <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-primary" />
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tight">Time Slots</h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>슬롯을 클릭하여 예약자 확인 및 신규 예약이 가능합니다.</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in fade-in duration-700">
              {slots.map((slot) => (
                <TimeSlotCard
                  key={slot.time}
                  slot={slot}
                  onClick={() => handleSlotClick(slot)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slot={selectedSlot}
        onSuccess={handleReservationSuccess}
      />
    </div>
  )
}
