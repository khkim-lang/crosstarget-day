export type Reservation = {
  id: string;
  time: string; // "14:00", "14:30", etc.
  team: string;
  name: string;
  email: string;
  phone: string;
  attendees: number;
  industry: string;
};

export type TimeSlot = {
  time: string;
  sessionName: string;
  isReserved: boolean; // We'll keep this but it won't be used to block sign-ups anymore
};

const sessionMap: Record<string, string> = {
  "14:00": "식음료",
  "15:00": "금융",
  "16:00": "교육",
  "17:00": "부동산/분양",
};

// Generate slots from 14:00 to 17:00 (1 hour intervals)
const generateInitialSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 14; hour <= 17; hour++) {
    const time = `${hour}:00`;
    slots.push({
      time,
      sessionName: sessionMap[time] || "일반 세션",
      isReserved: false
    });
  }
  return slots;
};

class Store {
  slots: TimeSlot[] = generateInitialSlots();
  reservations: Reservation[] = [];

  getSlots() {
    // Return slots with current reservation counts or just the slots
    return this.slots;
  }

  getReservationsByTime(time: string) {
    return this.reservations.filter(r => r.time === time);
  }

  addReservation(reservation: Omit<Reservation, "id">) {
    const slot = this.slots.find((s) => s.time === reservation.time);
    if (!slot) {
      throw new Error("Invalid time slot");
    }

    const newReservation: Reservation = {
      ...reservation,
      id: Math.random().toString(36).substring(7),
    };

    this.reservations.push(newReservation);
    // slot.isReserved = true; // No longer blocking

    return newReservation;
  }
}

// Global store instance to persist state across API requests during development
const globalForStore = global as unknown as { store: Store };

export const store = globalForStore.store || new Store();

if (process.env.NODE_ENV !== "production") globalForStore.store = store;
