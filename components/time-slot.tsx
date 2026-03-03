"use client"

import { cn } from "@/lib/utils"
import { TimeSlot } from "@/lib/store"

interface TimeSlotCardProps {
    slot: TimeSlot & { reservationCount: number; sessionName: string }
    onClick: () => void
    disabled?: boolean
}

export function TimeSlotCard({ slot, onClick, disabled }: TimeSlotCardProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "relative flex w-full flex-col items-center justify-center rounded-xl border p-6 text-center transition-all duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "cursor-pointer border-border bg-card hover:border-primary/50 hover:shadow-md active:scale-[0.98]"
            )}
        >
            <span className="text-2xl font-light tracking-tight">{slot.time}</span>
            <span className="mt-1 text-base font-medium text-foreground">{slot.sessionName}</span>
            <div className="mt-3 flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">
                    신청 {slot.reservationCount}명
                </span>
            </div>
        </button>
    )
}
