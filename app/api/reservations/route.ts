import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const time = searchParams.get("time");

    // Fetch all reservations from Supabase
    const { data: reservations, error } = await supabase
        .from('reservations')
        .select('*');

    if (error) {
        console.error("Supabase fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (time) {
        const filtered = reservations.filter(r => r.time === time);
        return NextResponse.json({ reservations: filtered });
    }

    const slots = store.getSlots();
    // Calculate reservation count for each slot from Supabase data
    const slotsWithCount = slots.map(slot => ({
        ...slot,
        reservationCount: reservations.filter(r => r.time === slot.time).length
    }));

    return NextResponse.json({ slots: slotsWithCount });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Insert into Supabase
        const { data: reservation, error } = await supabase
            .from('reservations')
            .insert([
                {
                    time: body.time,
                    team: body.team,
                    name: body.name,
                    email: body.email,
                    phone: body.phone,
                    attendees: parseInt(body.attendees, 10),
                    industry: body.industry
                }
            ])
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        // 2. Sync to Google Sheets if webhook is configured
        const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
        if (webhookUrl) {
            const slot = store.getSlots().find(s => s.time === reservation.time);
            fetch(webhookUrl, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...reservation,
                    sessionName: slot?.sessionName || ""
                }),
            }).catch(err => console.error("Google Sheets sync failed:", err));
        }

        return NextResponse.json(reservation, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to create reservation" },
            { status: 400 }
        );
    }
}
