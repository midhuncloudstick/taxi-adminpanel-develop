
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Driver } from "@/data/mockData";
import { useAppSelector } from "@/redux/hook";
import { sortingInBooking } from "@/redux/Slice/bookingSlice";
import { getDrivers } from "@/redux/Slice/driverSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
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

  const driverslist = useAppSelector(state => state.driver.drivers);
  useEffect(() => {
    dispatch(getDrivers())
  }, [dispatch])





  return (
    <div className="flex flex-row justify-between w-full">

    
 <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {showPending && <SelectItem value="requested">Requested</SelectItem>}
          <SelectItem value="waiting for driver confirmation">Waiting for driver Confirmation</SelectItem>
          <SelectItem value="assigned driver">Assigned Driver</SelectItem>
          <SelectItem value="journey started">Journey Started</SelectItem>
          <SelectItem value="pickup">Pickup</SelectItem>
          <SelectItem value="journey completed">Journey Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

    <div className="flex flex-col md:flex-row gap-2 mb-4">


      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {showPending && <SelectItem value="requested">Requested</SelectItem>}
          <SelectItem value="waiting for driver confirmation">Waiting for driver Confirmation</SelectItem>
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
          {Array.isArray (driverslist)&&driverslist?.map(d => (
            <SelectItem value={d.name.toString()} key={d.id}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="w-[180px]"
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder="Pickup/Drop Location"
      />
      <Input
        className="w-[160px]"
        value={customerId}
        onChange={e => setCustomerId(e.target.value)}
        placeholder="Customer Name"
      />

      
    </div>
   
    </div>
  );
}
