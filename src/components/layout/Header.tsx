import { useEffect, useRef, useState } from "react";
import { Bell, Car, Search, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UpcomingTripsDropdown } from "./UpcomingTripsDropdown";
import { getAvailableCars } from "@/redux/Slice/fleetSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getAvailableDrivers } from "@/redux/Slice/driverSlice";
import { setnotificationsoundfasle } from "@/redux/Slice/notificationSlice";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [showCarList, setShowCarList] = useState(false);
  const [showDriverList, setShowDriverList] = useState(false);
  const [carSearchTerm, setCarSearchTerm] = useState("");
  const [driverSearchTerm, setDriverSearchTerm] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const availablecarslist = useAppSelector((state) => state.fleet.AvailableCars) ?? [];
  const availabledriverslist = useAppSelector((state) => state.driver.AvailableDrivers) ?? [];
  const upcoming = useAppSelector((state) => state.notification.notification) || [];
  const playsound = useAppSelector((state) => state.notification.ringnotification);

  // Filter cars based on search term
  const filteredCars = availablecarslist.filter(car => 
    car.model.toLowerCase().includes(carSearchTerm.toLowerCase()) ||
    car.plate.toLowerCase().includes(carSearchTerm.toLowerCase())
  );

  // Filter drivers based on search term
  const filteredDrivers = availabledriverslist.filter(driver => 
    driver.name.toLowerCase().includes(driverSearchTerm.toLowerCase()) ||
    driver.licenceNumber.toLowerCase().includes(driverSearchTerm.toLowerCase())
  );

  useEffect(() => {
    if (playsound) {
      audioRef.current = new Audio('/notification.mp3');
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.warn("Audio playback failed:", error);
        });
        setTimeout(() => {
          audioRef.current = null;
        }, 500);
      }
      dispatch(setnotificationsoundfasle());
    }
  }, [playsound]);

  useEffect(() => {
    dispatch(getAvailableCars());
    dispatch(getAvailableDrivers());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCarList(false);
        setShowDriverList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="py-4 px-6 border-b border-gray-200 bg-white flex flex-col sm:flex-row justify-between gap-4 relative">
      {/* Car Info Section */}
      <div className="absolute z-10 flex flex-row gap-8" ref={dropdownRef}>
        {/* Available Cars Section */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              setShowDriverList(false);
              setShowCarList((prev) => !prev);
            }}
          >
            <Car className="w-5 h-5" />
            <span className="font-semibold text-taxi-blue">
              Available cars: {availablecarslist?.length ?? 0}
            </span>
          </div>

          {showCarList && (
            <div className="absolute mt-2 border rounded p-4 shadow-lg max-h-60 overflow-y-auto space-y-2 bg-white z-20 w-64">
              <h4 className="font-semibold text-taxi-blue">Available Cars</h4>
              {/* Car search input */}
              <div className="mb-2">
                <Input
                  type="text"
                  placeholder="Search cars..."
                  value={carSearchTerm}
                  onChange={(e) => setCarSearchTerm(e.target.value)}
                  className="w-full p-2 text-sm"
                />
              </div>
              <ul className="space-y-1">
                {filteredCars.length > 0 ? (
                  filteredCars.map((car) => (
                    <li
                      key={car.id}
                      className="border p-2 rounded hover:bg-gray-100 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="font-medium">{car.model}</div>
                      <div className="text-sm text-gray-500">{car.plate}</div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-center text-gray-500 text-sm">
                    {carSearchTerm ? 'No matching cars found' : 'No cars available'}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Available Drivers Section */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              setShowCarList(false);
              setShowDriverList((prev) => !prev);
            }}
          >
            <UserCheck className="w-5 h-5" />
            <span className="font-semibold text-taxi-blue">
              Available Drivers: {availabledriverslist?.length ?? 0}
            </span>
          </div>

          {showDriverList && (
            <div className="absolute mt-2 border rounded p-4 shadow-lg max-h-60 overflow-y-auto space-y-2 bg-white z-20 w-64">
              <h4 className="font-semibold text-taxi-blue">Available Drivers</h4>
              {/* Driver search input */}
              <div className="mb-2">
                <Input
                  type="text"
                  placeholder="Search drivers..."
                  value={driverSearchTerm}
                  onChange={(e) => setDriverSearchTerm(e.target.value)}
                  className="w-full p-2 text-sm"
                />
              </div>
              <ul className="space-y-1">
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver) => (
                    <li
                      key={driver.id}
                      className="border p-2 rounded hover:bg-gray-100 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-gray-500">
                        Licence: {driver.licenceNumber}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-center text-gray-500 text-sm">
                    {driverSearchTerm ? 'No matching drivers found' : 'No drivers available'}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Search and Notification Section */}
      <div className="flex items-center gap-4 ml-auto mr-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setNotifOpen((open) => !open)}
          >
            <Bell size={20} />
            {upcoming && upcoming.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-taxi-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {upcoming.length}
              </span>
            )}
          </Button>
          <UpcomingTripsDropdown open={notifOpen} setopen={setNotifOpen} />
          {notifOpen && (
            <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}