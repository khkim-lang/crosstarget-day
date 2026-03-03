import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const time = searchParams.get("time");

    if (time) {
        const reservations = store.getReservationsByTime(time);
        return NextResponse.json({ reservations });
    }

    const slots = store.getSlots();
    // For each slot, we can include the current reservations count
    const slotsWithCount = slots.map(slot => ({
        ...slot,
        reservationCount: store.getReservationsByTime(slot.time).length
    }));

    return NextResponse.json({ slots: slotsWithCount });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // basic validation
        if (!body.time || !body.team || !body.name || !body.email || !body.phone || !body.attendees || !body.industry) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const reservation = store.addReservation(body);

        return NextResponse.json({ success: true, reservation });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to reserve" }, { status: 400 });
    }
}
