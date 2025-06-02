
import { useEffect, useState } from "react";
import { Bell, Car, Search, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UpcomingTripsDropdown } from "./UpcomingTripsDropdown";
import { getAvailableCars } from "@/redux/Slice/fleetSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getAvailableDrivers } from "@/redux/Slice/driverSlice";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const [showCarList, setShowCarList] = useState(false);
  const [showDriverList, setShowDriverList] = useState(false)
  const dispatch = useAppDispatch();

  const availablecarslist = useAppSelector((state) => state.fleet.cars)
  const availabledriverslist = useAppSelector((state) => state.driver.drivers)
  useEffect(() => {
    dispatch(getAvailableCars())
    dispatch((getAvailableDrivers()))
  }, [dispatch])
  return (



    <div className="py-4 px-6 border-b border-gray-200 bg-white flex flex-col sm:flex-row justify-between gap-4 relative">
      
  {/* Title First */}
  <h1 className="text-2xl font-bold text-taxi-blue">{title}</h1>

  {/* Available Cars */}
  <div></div>
      <div className="space-y-4">
        <div>
          {/* Clickable section */}
           <div
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
            onClick={() => setShowCarList(prev => !prev)}
          >
            <Car className="w-5 h-5" />
            <span className="font-semibold text-taxi-blue">Available cars: {availablecarslist.length}</span>
          </div>


          {/* Inline expandable car list */}
          {showCarList && (
            <div className="mt-2 border rounded p-4 shadow-sm max-h-60 overflow-y-auto space-y-2 bg-white">
              <h4 className="font-semibold text-taxi-blue">Available Cars</h4>
              <ul className="space-y-1">
                {availablecarslist.map((car) => (
                  <li
                    key={car.id}
                    className="border p-2 rounded hover:bg-gray-100 transition"
                  >
                    <div className="font-medium">{car.model}</div>
                    <div className="text-sm text-gray-500">{car.plate}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
      <div className="space-y-4">
        <div>
          {/* Clickable section */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
            onClick={() => setShowDriverList(prev => !prev)}
          >
            <UserCheck className="w-5 h-5" />
            <span className="font-semibold text-taxi-blue">Available Drivers: {availabledriverslist.length}</span>
          </div>

          {/* Inline expandable driver list */}
          {showDriverList && (
            <div className="mt-2 border rounded p-4 shadow-sm max-h-60 overflow-y-auto space-y-2 bg-white">
              <h4 className="font-semibold text-taxi-blue">Available Drivers</h4>
              <ul className="space-y-1">
                {availabledriverslist.map((driver) => (
                  <li
                    key={driver.id}
                    className="border p-2 rounded hover:bg-gray-100 transition"
                  >
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-sm text-gray-500">
                      Licence: {driver.licenceNumber}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>


     

      <div className="flex items-center gap-4">
        <div className={cn("relative flex items-center", "w-full sm:w-auto")}>
          <Search className="absolute left-3 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 text-sm bg-slate-50 border-slate-200 focus:ring-taxi-teal"
          />
        </div>

        <div className="relative">
          <Button variant="ghost" size="icon" className="relative"
            onClick={() => setNotifOpen(open => !open)}
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-taxi-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          <UpcomingTripsDropdown open={notifOpen} />
          {notifOpen && (
            <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
