import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Driver } from "@/data/mockData";
import { useAppSelector } from "@/redux/hook";
import { sortingInBooking } from "@/redux/Slice/bookingSlice";
import { getDrivers } from "@/redux/Slice/driverSlice";
import { setToggleid } from "@/redux/Slice/notificationSlice";
import { AppDispatch } from "@/redux/store";
import { ArrowUp, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

interface BookingsFilterBarProps {
  status: string;
  driver: string;
  location: string;
  customerId: string;
  setStatus: (val: string) => void;
  setDriver: (val: string) => void;
  setLocation: (val: string) => void;
  setCustomerId: (val: string) => void;
  setpage: (val: number) => void;
  drivers: Driver[];
  showPending?: boolean;
}

export function BookingsFilterBar({
  status,
  driver,
  location,
  customerId,
  setStatus,
  setDriver,
  setLocation,
  setCustomerId,
  drivers,
  showPending,
}: BookingsFilterBarProps) {
  const dispatch = useDispatch<AppDispatch>();

  const driverslist = useAppSelector((state) => state.driver.drivers);
  const alertlist = useAppSelector((state) => state.notification.alretList);
  const dropdownRef = useRef(null);

  const [open, setopen] = useState(false);
  useEffect(() => {

    dispatch(getDrivers({ page: 0, limit: 0, search: '' }));
  }, [dispatch]);

  const setid = (id: string) => {
    try {
      dispatch(setToggleid(id));
      setTimeout(() => {
        dispatch(setToggleid(''))
      }, 5000);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    } finally {
      setopen(false);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setopen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTime = (time: string) => {
    const localTimeString = time.replace(/Z$/, ""); 
    return new Date(localTimeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };




  return (
    <div className="flex flex-row justify-between w-full">
      {/* <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
           

        </SelectContent>
      </Select> */}
      <div
        className="h-10 w-52 relative bg-white border border-gray-200 flex justify-center items-center cursor-pointer rounded-lg"
        onClick={() => setopen(!open)}
        ref={dropdownRef}
      >
        <span className="flex items-center gap-2">
          Over Due Pickup Time{" "}
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}{" "}
        </span>
        {alertlist.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-taxi-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {alertlist?.length}
          </span>
        )}

        {open && (
          <div className="absolute left-0 top-full mt-2 w-48 rounded shadow-lg z-40 bg-white border px-0 py-2 overflow-auto max-h-[360px]">
            <div className="py-2 border-b font-medium text-taxi-blue flex items-center gap-2 w-full">
              <ul>
                {alertlist && alertlist.length === 0 && (
                  <li className="hover:bg-slate-50 px-4 py-2 border-b last:border-0 transition-all cursor-pointer w-full bg-white text-sm text-gray-400 font-normal">
                    No Over Due Pickup Time
                  </li>
                )}
                {alertlist && alertlist.length > 0 && alertlist.map((item) => (
                  <li
                    className="hover:bg-slate-50 px-4 py-2 border-b last:border-0 transition-all cursor-pointer w-44 bg-white"
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setid(item.id);
                      setopen(false);
                    }}
                  >
                    <div>{item.id}</div>
                    <span className="text-gray-400 text-xs font-normal">
                      Pickup :
                    </span>{" "}
                    <span className="text-red-300 text-xs font-normal">
                      {formatTime(item.pickupTime)} -{" "}
                      {new Date(item.pickupTime).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit"
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {showPending && (
              <SelectItem value="requested">Requested</SelectItem>
            )}
            <SelectItem value="waiting for driver confirmation">
              Waiting for driver Confirmation
            </SelectItem>
            <SelectItem value="assigned driver">Assigned Driver</SelectItem>
            <SelectItem value="journey started">Journey Started</SelectItem>
            <SelectItem value="pickup">Pickup</SelectItem>
            <SelectItem value="journey completed">Journey Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={driver} onValueChange={setDriver}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Driver" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Drivers</SelectItem>
            {Array.isArray(driverslist) &&
              driverslist?.map((d) => (
                <SelectItem value={d.id.toString()} key={d.id}>
                  {d.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Input
          className="w-[180px]"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Pickup/Drop Location"
        />
        <Input
          className="w-[160px]"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Customer Name"
        />
      </div>
    </div>
  );
}
