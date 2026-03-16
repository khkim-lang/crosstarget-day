"use client"

import { useEffect, useState } from "react"
import { TimeSlot } from "@/lib/store"
import { TimeSlotCard } from "@/components/time-slot"
import { ReservationModal } from "@/components/reservation-modal"
import { Loader2, AlertCircle, ChevronDown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  const [slots, setSlots] = useState<(TimeSlot & { reservationCount: number })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<(TimeSlot & { reservationCount: number }) | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchSlots = async () => {
    try {
      const res = await fetch("/api/reservations")
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setSlots(data.slots || [])
        if (data.warning) console.warn("API Warning:", data.warning)
      }
    } catch (err: any) {
      console.error("Failed to fetch slots:", err)
      setError("데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")
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

  const scrollToPoster = () => {
    const element = document.getElementById('event-poster');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
        {/* Header Section */}
        <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            CrossTarget Day for DMC미디어
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            2026년 3월 19일 마이크로 세션 예약
          </p>
          <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-primary" />

          <button
            onClick={scrollToPoster}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            상세 행사 안내 보기
            <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
          </button>
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

          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>오류 발생</AlertTitle>
              <AlertDescription>
                {error}
                <div className="mt-2 text-xs opacity-70">
                  Vercel 환경 변수 설정을 확인해 주세요.
                </div>
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in fade-in duration-700">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <TimeSlotCard
                    key={slot.time}
                    slot={slot}
                    onClick={() => handleSlotClick(slot)}
                  />
                ))
              ) : (
                <div className="col-span-full border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
                  표시할 예약 슬롯이 없습니다.
                </div>
              )}
            </div>
          )}

          {/* Scroll Guidance Arrow */}
          <div className="mt-16 flex flex-col items-center justify-center animate-bounce opacity-50">
            <p className="text-xs text-muted-foreground mb-2">상세 안내 보기</p>
            <ChevronDown className="h-6 w-6" />
          </div>

          {/* Event Poster Section */}
          <div id="event-poster" className="mt-16 border-t pt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="mb-8 text-center">
              <h3 className="text-3xl font-semibold tracking-tight">행사 안내</h3>
              <p className="mt-3 text-lg text-muted-foreground">
                💡 마이크로 세션 예약 전, 아래 포스터를 통해 당일 행사의 주요 경품과 세부 내용을 확인해 보세요!
              </p>
            </div>
            <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border shadow-2xl bg-card">
              <img
                src="/poster.png"
                alt="CrossTarget Day Event Poster"
                className="w-full h-auto"
              />
            </div>
          </div>
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
