
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Driver } from "@/data/mockData";

interface BookingsFilterBarProps {
  status: string;
  driver: string;
  location: string;
  customerId: string;
  setStatus: (val: string) => void;
  setDriver: (val: string) => void;
  setLocation: (val: string) => void;
  setCustomerId: (val: string) => void;
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
  return (
    <div className="flex flex-col md:flex-row gap-2 mb-4">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {showPending && <SelectItem value="pending">Pending</SelectItem>}
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Select value={driver} onValueChange={setDriver}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Driver" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Drivers</SelectItem>
          {drivers.map(d => (
            <SelectItem value={d.id} key={d.id}>{d.name}</SelectItem>
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
        placeholder="Customer ID"
      />
    </div>
  );
}
