import React, { useEffect, useState } from "react";
import { getCarById } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Edit, User } from "lucide-react";
import { Button } from "../ui/button";
import { EditDriverForm } from "../drivers/EditDriverForm";
import { Cars } from "@/types/fleet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getDrivers } from "@/redux/Slice/driverSlice";

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
  type:"internal"|"external";
};

interface DriversTableProps {
  drivers: Drivers[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onEdit: (driver: Drivers) => void; // accepts a single driver
}

export function DriversTable({ drivers, selectedId, onSelect, onEdit }: DriversTableProps) {
  const [driverData, setDriversData] = useState<Drivers[]>(drivers);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState<Drivers | null>(null);
  const dispatch = useDispatch<AppDispatch>()
  



useEffect(() => {
console.log("reached the driverlisting")
dispatch(getDrivers())
}, [dispatch]);

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

  return (
    <div className="overflow-auto rounded-lg shadow bg-white">
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
          {[...driverData].reverse().map((d) => (
            <TableRow
              key={d.id}
              data-selected={selectedId === d.id}
              onClick={() => onSelect(d.id)}
              className={`cursor-pointer ${selectedId === d.id ? "bg-blue-50" : ""}`}
            >
              <TableCell>
                <Avatar className="h-10 w-10">
                  {d.photo ? (
                    <AvatarImage src={`https://brisbane.cloudhousetechnologies.com${d.photo}`} alt={d.name} />
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
              <TableCell>{d.type}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-11">
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

      {/* Render the form just once outside the table */}
      {driverToEdit && (
        <EditDriverForm
          driver={driverToEdit}
          IsOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSave={handleSaveEditedDriver}
          onSuccess={() => {
            console.log("Driver updated successfully");
          }}
        />
      )}
    </div>
  );
}
