"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { TimeSlot, Reservation } from "@/lib/store"

const formSchema = z.object({
    team: z.string().min(1, "소속 팀을 입력해주세요"),
    name: z.string().min(1, "이름을 입력해주세요"),
    email: z.string().email("유효한 이메일을 입력해주세요"),
    phone: z.string().min(1, "연락처를 입력해주세요"),
    industry: z.string().min(1, "담당 업종을 입력해주세요"),
})

type FormData = z.infer<typeof formSchema>

interface ReservationModalProps {
    isOpen: boolean
    onClose: () => void
    slot: (TimeSlot & { reservationCount: number; sessionName: string }) | null
    onSuccess: () => void
}

export function ReservationModal({ isOpen, onClose, slot, onSuccess }: ReservationModalProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [view, setView] = React.useState<"list" | "form">("list")
    const [reservations, setReservations] = React.useState<Reservation[]>([])
    const [isLoadingList, setIsLoadingList] = React.useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    })

    const fetchReservations = React.useCallback(async () => {
        if (!slot) return
        setIsLoadingList(true)
        try {
            const res = await fetch(`/api/reservations?time=${slot.time}`)
            const data = await res.json()
            setReservations(data.reservations || [])
        } catch (err) {
            console.error("Failed to fetch reservations:", err)
        } finally {
            setIsLoadingList(false)
        }
    }, [slot])

    // Reset form and view when modal opens
    React.useEffect(() => {
        if (isOpen) {
            reset()
            setError(null)
            setView("list")
            fetchReservations()
        }
    }, [isOpen, reset, fetchReservations])

    if (!isOpen || !slot) return null

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    time: slot.time,
                    ...data,
                }),
            })

            if (!res.ok) {
                throw new Error(await res.text())
            }

            onSuccess()
            fetchReservations()
            setView("list")
        } catch (err: any) {
            setError(err.message || "예약 중 오류가 발생했습니다.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border bg-card p-6 shadow-xl sm:p-8 animate-in slide-in-from-bottom-4 duration-300">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {view === "list" ? "예약자 명단" : "세션 예약"}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {slot.time} • <span className="font-semibold text-foreground">{slot.sessionName}</span>
                    </p>
                </div>

                {view === "list" ? (
                    <div className="space-y-6">
                        <div className="max-h-[300px] overflow-y-auto pr-2">
                            {isLoadingList ? (
                                <div className="flex h-32 items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : reservations.length > 0 ? (
                                <div className="divide-y border-t border-b">
                                    {reservations.map((res) => (
                                        <div key={res.id} className="py-4 last:pb-0">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{res.name} <span className="text-xs text-muted-foreground ml-1">({res.team})</span></p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{res.industry} • 참석 {res.attendees}명</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-sm text-muted-foreground">
                                    아직 예약자가 없습니다. 첫 예약을 등록해보세요!
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setView("form")}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                나도 예약하기
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="team" className="text-sm font-medium leading-none">소속 팀</label>
                                <input {...register("team")} id="team" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="예: 마케팅팀" />
                                {errors.team && <p className="text-[13px] text-destructive">{errors.team.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium leading-none">이름</label>
                                <input {...register("name")} id="name" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="홍길동" />
                                {errors.name && <p className="text-[13px] text-destructive">{errors.name.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">이메일</label>
                            <input {...register("email")} id="email" type="email" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="name@company.com" />
                            {errors.email && <p className="text-[13px] text-destructive">{errors.email.message}</p>}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium leading-none">연락처</label>
                                <input {...register("phone")} id="phone" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="010-0000-0000" />
                                {errors.phone && <p className="text-[13px] text-destructive">{errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="industry" className="text-sm font-medium leading-none">담당 업종</label>
                                <input {...register("industry")} id="industry" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="예: IT / 플랫폼" />
                                {errors.industry && <p className="text-[13px] text-destructive">{errors.industry.message}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                            <button type="button" onClick={() => setView("list")} className="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary">뒤로가기</button>
                            <button type="submit" disabled={isSubmitting} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "예약하기"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div >
    )
}
