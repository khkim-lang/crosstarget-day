import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Helper to clean environment variables (removes literal quotes if present)
const sanitize = (val: string | undefined) => {
    if (!val) return val
    return val.trim().replace(/^["']|["']$/g, "")
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const time = searchParams.get("time");

    const slots = store.getSlots();
    let reservations: any[] = [];

    try {
        // Fetch all reservations from Supabase
        const { data, error } = await supabase
            .from('reservations')
            .select('*');

        if (error) {
            console.error("[Supabase GET] Query error:", error);
        } else {
            reservations = data || [];
        }
    } catch (err) {
        console.error("[Supabase GET] Critical error during fetch:", err);
    }

    if (time) {
        const filtered = reservations.filter(r => r.time === time);
        return NextResponse.json({ reservations: filtered });
    }

    // Calculate reservation count for each slot
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
            console.error("[Supabase] Insert error:", error);
            throw new Error(`Supabase Error: ${error.message}`);
        }

        // 2. Sync to Google Sheets if webhook is configured
        const webhookUrl = sanitize(process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL);

        if (webhookUrl) {
            const slot = store.getSlots().find(s => s.time === reservation.time);
            const payload = {
                ...reservation,
                sessionName: slot?.sessionName || ""
            };

            console.log(`[Google Sheets] Sending payload to: ${webhookUrl}`);

            // Fire and forget (but catch errors)
            fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then(async (res) => {
                    console.log(`[Google Sheets] Response status: ${res.status}`);
                })
                .catch(err => {
                    console.error("[Google Sheets] Sync failed error:", err);
                });
        }

        return NextResponse.json(reservation, { status: 201 });
    } catch (error: any) {
        console.error("Critical error in POST /api/reservations:", error);

        // Check if it's a known configuration error we threw
        const errorMessage = error.message || "Failed to create reservation";
        const isConfigError = errorMessage.includes("Supabase environment variables") ||
            errorMessage.includes("Invalid Supabase URL");

        return NextResponse.json(
            {
                error: errorMessage,
                details: error.toString(),
                advice: isConfigError ? "Please check Vercel Environment Variables naming and values." : undefined
            },
            { status: isConfigError ? 500 : 400 }
        );
    }
}
