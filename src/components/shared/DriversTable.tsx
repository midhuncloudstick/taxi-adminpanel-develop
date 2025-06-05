import React, { useEffect, useState } from "react";
import { getCarById } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Edit, User, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EditDriverForm } from "../drivers/EditDriverForm";
import { Cars } from "@/types/fleet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getDrivers } from "@/redux/Slice/driverSlice";
import { Pagination } from "../ui/paginationNew";
import { useAppSelector } from "@/redux/hook";
import { toast } from "sonner";

type Drivers = {
  id: number;
  name: string;
  email: string;
  phone: string;
  licenceNumber: string;
  carId: string;
  status: "active" | "inactive";
  rating: number;
  completedTrips: number;
  photo?: string;
  car: Cars[];
  type: "internal" | "external";
};

interface DriversTableProps {
  drivers: Drivers[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onEdit: (driver: Drivers) => void;
}

export function DriversTable({ drivers, selectedId, onSelect, onEdit }: DriversTableProps) {
  const [driverData, setDriversData] = useState<Drivers[]>([]);
  const driverDatah = useAppSelector((state) => state.driver.drivers);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState<Drivers | null>(null);
  const current_Page = useAppSelector((state) => state.driver.page || 1);
  const totalPages = useAppSelector((state) => state.driver.total_pages || 1);
  const [localPage, setLocalPage] = useState(current_Page);
  const dispatch = useDispatch<AppDispatch>();
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setDriversData(driverDatah);
  }, [driverDatah]);

  useEffect(() => {
    console.log("Fetching drivers...");
    dispatch(getDrivers({ page: current_Page, limit, search: searchQuery }));
  }, [dispatch, current_Page, limit, searchQuery]);

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   dispatch(getDrivers({ page: 1, limit, search: searchQuery }));
  //   setLocalPage(1);
  // };

  const handleSaveEditedDriver = (editedDriver: Drivers) => {
    setDriversData((prev) =>
      prev.map((driver) => (driver.id === editedDriver.id ? editedDriver : driver))
    );
    setIsEditFormOpen(false);
  };

  const handleEditClick = (driver: Drivers) => {
    setDriverToEdit(driver);
    setIsEditFormOpen(true);
  };

  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);
      await dispatch(getDrivers({ page: newPage, limit, search: searchQuery }));
      setLocalPage(newPage);
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-auto rounded-lg shadow bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Drivers Management</h2>
       
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search drivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
         
        
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Car</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {driverData.map((d) => (
            <TableRow
              key={d.id}
              data-selected={selectedId === d.id}
              onClick={() => onSelect(d.id)}
              className={`cursor-pointer ${selectedId === d.id ? "bg-blue-50" : ""}`}
            >
              <TableCell>
                <Avatar className="h-10 w-10">
                  {d.photo ? (
                    <AvatarImage 
                      src={`https://brisbane.cloudhousetechnologies.com${d.photo}`} 
                      alt={d.name}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <AvatarFallback className="bg-taxi-blue text-white">
                      <User size={16} />
                    </AvatarFallback>
                  )}
                </Avatar>
              </TableCell>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.email}</TableCell>
              <TableCell>{d.phone}</TableCell>
              <TableCell>{getCarById(d.carId)?.model || d.carId}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    d.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    d.type === "internal"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {d.type.charAt(0).toUpperCase() + d.type.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-taxi-teal hover:text-taxi-teal hover:bg-taxi-teal/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(d);
                    }}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="py-4 px-4">
        <Pagination
          currentPage={current_Page}
          itemsPerPage={limit}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={loading}
        />
      </div>

      {driverToEdit && (
        <EditDriverForm
          driver={driverToEdit}
          IsOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSave={handleSaveEditedDriver}
          currentPage={current_Page}
          searchQuery={searchQuery}
          onSuccess={() => {
            dispatch(getDrivers({ page: current_Page, limit, search: searchQuery }));
          }}
        />
      )}
    </div>
  );
}