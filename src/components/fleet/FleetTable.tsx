
import { useEffect, useState } from "react";
import { Car, cars } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Edit, Trash, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Deletecars, getCars } from "@/redux/Slice/fleetSlice";
import { useAppSelector } from "@/redux/hook";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface FleetTableProps {
  onEdit: (car: Car) => void;
  onDelete: (carId: string) => void;
}

export function FleetTable({ onEdit, onDelete }: FleetTableProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [carsData, setCarsData] = useState<Car[]>(cars);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const Vehicle = useAppSelector((state) => state.fleet.cars)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>;
      case "in-use":
        return <Badge className="bg-yellow-500">In Use</Badge>;
      case "maintenance":
        return <Badge className="bg-red-500">Maintenance</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const getCarTypeBadge = (type: string) => {
    switch (type) {
      case "sedan":
        return <Badge variant="outline" className="border-taxi-blue text-taxi-blue">Sedan</Badge>;
      case "suv":
        return <Badge variant="outline" className="border-taxi-teal text-taxi-teal">SUV</Badge>;
      case "luxury":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Luxury</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };



  useEffect(() => {
    console.log("reached the listing")
    dispatch(getCars())
  }, [dispatch]);




  const handleDelete = (carId: string) => {
    setCarToDelete(carId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!carToDelete) return;

    try {
      console.log("deletedddddd")
      await dispatch(Deletecars({ carId: carToDelete })).unwrap();
      await dispatch(getCars());

      setCarsData(carsData.filter((car) => car.id !== carToDelete));
      onDelete(carToDelete);
      toast.success("Car deleted successfully");
    } catch (error) {
      toast.error("Failed to delete car");
      console.error("Delete error:", error);
    } finally {
      setCarToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };


  return (
    <>
      <Table>
        <TableCaption>Fleet inventory of Brisbane Airport Taxi Service</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Plate Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Price/KM</TableHead>
            <TableHead>Fixed Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(Vehicle) &&
            Vehicle.map((car) => (
              <TableRow key={car.id}>
                <TableCell className="font-medium">{car.id}</TableCell>
                <Avatar className="h-1 w-1">
                  {Array.isArray(car.car_images) && car.car_images.length > 0 ? (
                    car.car_images.map((image, index) => (
                         <AvatarImage
                      src={`https://brisbane.cloudhousetechnologies.com${image.image_url} `}
                       crossOrigin="anonymous"

                        alt={image.Car?.model || `Image ${index + 1}`}
                       className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 shadow"
                    />
                    ))
                 
                  ) : (
                    <AvatarFallback className="bg-taxi-blue text-white">
                      <User size={16} />
                    </AvatarFallback>
                  )}
                </Avatar>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.plate}</TableCell>
                <TableCell>{getCarTypeBadge(car.type)}</TableCell>
                <TableCell>{car.capacity}</TableCell>
                <TableCell>
                  {car.pricePerKm ? `$${car.pricePerKm.toFixed(2)}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {car.fixedCost ? `$${car.fixedCost.toFixed(2)}` : 'N/A'}
                </TableCell>
                <TableCell>{getStatusBadge(car.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-taxi-teal hover:text-taxi-teal hover:bg-taxi-teal/10"
                      onClick={() => onEdit(car)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-taxi-red hover:text-taxi-red hover:bg-taxi-red/10"
                      onClick={() => handleDelete(car.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>

      </Table>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Car"
        description="Are you sure you want to delete this car from your fleet? This action cannot be undone."
        confirmText="Yes, Delete Car"
        cancelText="No, Keep Car"
      />
    </>
  );
}
