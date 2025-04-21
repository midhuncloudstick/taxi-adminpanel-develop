
import { useMemo } from "react";
import { bookings, getCustomerById } from "@/data/mockData";
import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";

// Not using any state for filter here. Shows all upcoming bookings!
export function UpcomingTripsDropdown({ open }: { open: boolean }) {
  const upcoming = useMemo(
    () => bookings.filter(b => b.status === "upcoming"), []
  );

  if (!open) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-[330px] rounded shadow-lg z-40 bg-white border px-0 py-2 overflow-auto max-h-[360px]">
      <div className="px-4 py-2 border-b font-medium text-taxi-blue flex items-center gap-2">
        <ArrowUp size={18} />
        Upcoming Trips ({upcoming.length})
      </div>
      {upcoming.length === 0 && (
        <div className="p-4 text-center text-gray-500 text-sm">No upcoming trips found.</div>
      )}
      <ul>
        {upcoming.map(trip => {
          const customer = getCustomerById(trip.customerId);
          return (
            <li key={trip.id} className="hover:bg-slate-50 px-4 py-2 border-b last:border-0 transition-all">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold">{trip.id}</span>
                  <span className="text-xs text-gray-500">{trip.pickupTime} / {trip.date}</span>
                </div>
                <div className="text-right flex flex-col gap-1">
                  <span className="text-taxi-blue text-xs">{trip.pickupLocation}</span>
                  <span className="text-xs text-gray-400">
                    {customer?.name ? `for ${customer.name}` : trip.customerId}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
