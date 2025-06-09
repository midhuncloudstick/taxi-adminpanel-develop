import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {  sortingInBooking, updateBookingStatus } from "@/redux/Slice/bookingSlice";
import { useAppSelector } from "@/redux/hook";
import { clearalert } from "@/redux/Slice/notificationSlice";

interface BookingStatusDropdownProps {
  bookingId: string;
  status: 'requested'|'waiting for driver confirmation'|'assigned driver'|'journey started'|'pickup'|'journey completed'|'cancelled';
 getlist: () => void;
}

const statusOptions = [
  { value: "requested", label: "Requested" },
  { value: "waiting for driver confirmation", label: "Waiting for Driver Confirmation" },
 
  { value: "journey started", label: "Journey Started" },
  { value: "pickup", label: "Pickup" },
  { value: "journey completed", label: "Journey Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusOptionss = [
  { value: "requested", label: "Requested" },
  { value: "waiting for driver confirmation", label: "Waiting for Driver Confirmation" },
  { value: "assigned driver", label: "Assigned Driver" },
  { value: "journey started", label: "Journey Started" },
  { value: "pickup", label: "Pickup" },
  { value: "journey completed", label: "Journey Completed" },
  { value: "cancelled", label: "Cancelled" },
];


export function BookingStatusDropdown({
  bookingId,
  status,
  getlist
}: BookingStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const alertdata =useAppSelector((state)=>state.notification.alretList)
  const dispatch = useDispatch<AppDispatch>();
  const page = 1;
  const limit = 10;
  const current_Page = useAppSelector((state) => state.booking.page || 1);
  function getStatusUI(s: string) {
    switch (s) {
      case "requested":
        return "bg-yellow-50 text-yellow-800";
      case "waiting for driver confirmation":
        return "bg-blue-50 text-blue-800";
      case "assigned driver":
        return "bg-taxi-teal/20 text-taxi-teal";
      case "journey started":
        return "bg-purple-100 text-purple-700";
      case "pickup":
        return "bg-orange-100 text-orange-700";
      case "journey completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-900";
    }
  }

  const handleSelect = async (newStatus: BookingStatusDropdownProps["status"]) => {
    if (newStatus !== status) {
      await dispatch(updateBookingStatus({ bookingId, status: newStatus }));

      if(status == 'assigned driver'){
        console.log(alertdata ,alertdata.length ,bookingId);
        
       if(alertdata.length==1 && alertdata[0].id == bookingId ){
        dispatch(clearalert(0))
       }else{
        const findeindex = alertdata.findIndex((item) => item.id == bookingId );
      console.log('the index for status',findeindex);
      
      if(findeindex>-1){
dispatch(clearalert(findeindex))
      }
       }
         

//  await dispatch(sortingInBooking({
//   search: "",          // or your current search term
//   customerID: "",      // or current customer id filter
//   status: "",          // or current status filter
//   driver: "",          // or current driver filter
//   bookingId: "",       // or current booking id filter
//   date: "",            // or current date filter
//   pickup_time: "",     // or current pickup time filter
//   page: current_Page,
//   limit: limit,
//   // sortBy: sortKey,
//   // sortOrder: sortDirection,
// }));

    }
   await getlist()
  }
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "  rounded-full text-xs font-medium flex items-center gap-1 group focus:bg-gray-100",
          getStatusUI(status),
          "cursor-pointer"
        )}
        type="button"
        onClick={() => setOpen(o => !o)}
        tabIndex={0}
      >
        <span>{statusOptionss.find(opt => opt.value === status)?.label || status}</span>
        {/* <ArrowDown size={14} className="inline ml-1 group-hover:opacity-60" /> */}
      </Button>
      {open && (
        <div className="absolute z-50 right-0 top-full bg-white border shadow rounded p-2 min-w-[180px]">
          <ul>
            {statusOptions.map(opt => (
              <li
                key={opt.value}
                className={cn(
                  "px-4 py-2 hover:bg-blue-50 cursor-pointer rounded",
                  opt.value === status && "font-semibold bg-blue-100"
                )}
                onClick={() => handleSelect(opt.value as BookingStatusDropdownProps["status"])}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
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