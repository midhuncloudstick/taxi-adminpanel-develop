
import { useMemo } from "react";
import { bookings, getCustomerById } from "@/data/mockData";
import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useDispatch } from "react-redux";
import { notificationRead, setToggleid } from "@/redux/Slice/notificationSlice";
import { useNavigate } from "react-router-dom";

// Not using any state for filter here. Shows all upcoming bookings!
export function UpcomingTripsDropdown({ open,setopen }: { open: boolean ,setopen: React.Dispatch<React.SetStateAction<boolean>>}) {
  const dispatch =useDispatch()
  const appDispatch = useAppDispatch()
   const navigate =useNavigate()
  // const upcoming = useMemo(
  //   () => bookings.filter(b => b.status === "requested"), []
  // );



  const upcoming = useAppSelector((state) => state.notification.notification) || [];

const setid = async(id:string)=>{
  try {
    await appDispatch(notificationRead(id))
    dispatch(setToggleid(id))
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  }finally{
    setopen(false)
  }
}

  if (!open) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-[330px] rounded shadow-lg z-40 bg-white border px-0 py-2 overflow-auto max-h-[360px]">
      <div className="px-4 py-2 border-b font-medium text-taxi-blue flex items-center gap-2">
        <ArrowUp size={18} />
        Upcoming Trips ({upcoming &&upcoming.length})
      </div>
      {upcoming.length ==0 && (
        <div className="p-4 text-center text-gray-500 text-sm">No upcoming trips found.</div>
      )}
      <ul>
        {
        upcoming && upcoming.length>0 &&
        upcoming.map(trip => {
          // const customer = getCustomerById(trip.customerId);
          return (
            <li
              key={trip.id}
              className="hover:bg-slate-50 px-4 py-2 border-b last:border-0 transition-all cursor-pointer"
              onClick={() => {
                
                if (window.location.pathname !== "/") {
                 navigate('/')
               
                setTimeout(() => {
                  setid(trip.id);
                }, 400);
 }else{
  setid(trip.id);
 }

              }}


            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold">{trip.id}</span>
                  <span className="text-xs text-gray-500">{trip.pickuptime} </span>
                </div>
                <div className="text-right flex flex-col gap-1">
                  <span className="text-taxi-blue text-xs">{trip.location}</span>
                  {/* <span className="text-xs text-gray-400">
                    {customer?.name ? `for ${customer.name}` : trip.customerId}
                  </span> */}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  );
}