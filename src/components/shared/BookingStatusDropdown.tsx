
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingStatusDropdownProps {
  status: "pending" | "waiting for confirmation" | "upcoming" | "completed" | "cancelled";
  onApprove?: () => void;
  onCancel?: () => void;
}

export function BookingStatusDropdown({
  status,
  onApprove,
  onCancel,
}: BookingStatusDropdownProps) {
  const [open, setOpen] = useState(false);

  // Colors for each status
  function getStatusUI(s: string) {
    switch (s) {
      case "pending":
        return "bg-yellow-50 text-yellow-800";
      case "waiting for confirmation":
        return "bg-orange-50 text-orange-800";
      case "upcoming":
        return "bg-taxi-teal/20 text-taxi-teal";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-900";
    }
  }

  // Dropdown content for each relevant status
  let dropdownContent = null;
  if (status === "pending" || status === "waiting for confirmation") {
    dropdownContent = (
      <div className="absolute z-20 mt-2 min-w-[140px] right-0 bg-white border shadow rounded [&>*]:flex [&>*]:px-4 [&>*]:py-2">
        <button
          className="hover:bg-green-50 w-full flex items-center gap-2"
          onClick={() => {
            setOpen(false);
            onApprove?.();
          }}
        >
          <Check size={16} className="text-green-600" />
          Approve Booking
        </button>
        <button
          className="hover:bg-red-50 w-full flex items-center gap-2"
          onClick={() => {
            setOpen(false);
            onCancel?.();
          }}
        >
          <X size={16} className="text-taxi-red" />
          Cancel Booking
        </button>
      </div>
    );
  } else if (status === "upcoming") {
    dropdownContent = (
      <div className="absolute z-20 mt-2 min-w-[140px] right-0 bg-white border shadow rounded">
        <button
          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50"
          onClick={() => {
            setOpen(false);
            onCancel?.();
          }}
        >
          <X size={16} className="text-taxi-red" />
          Cancel Booking
        </button>
      </div>
    );
  }

  const showDropdown = status === "pending" || status === "waiting for confirmation" || status === "upcoming";
  const displayText = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 group focus:bg-gray-100",
          getStatusUI(status),
          showDropdown && "cursor-pointer"
        )}
        type="button"
        onClick={() => showDropdown && setOpen(o => !o)}
        tabIndex={0}
      >
        <span>{displayText}</span>
        {showDropdown && (
          <ArrowDown size={14} className="inline ml-1 group-hover:opacity-60" />
        )}
      </Button>
      {open && (
        <div className="absolute z-50 right-0 top-full">{dropdownContent}</div>
      )}
      {/* Background overlay to close on outside click */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-label="Close Status Dropdown"
        />
      )}
    </div>
  );
}
