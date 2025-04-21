
import { useState } from "react";
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
import { Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface FleetTableProps {
  onEdit: (car: Car) => void;
  onDelete: (carId: string) => void;
}

export function FleetTable({ onEdit, onDelete }: FleetTableProps) {
  const [carsData, setCarsData] = useState<Car[]>(cars);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleDelete = (carId: string) => {
    setCarToDelete(carId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (carToDelete) {
      setCarsData(carsData.filter(car => car.id !== carToDelete));
      onDelete(carToDelete);
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
            <TableHead>Model</TableHead>
            <TableHead>Plate Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carsData.map((car) => (
            <TableRow key={car.id}>
              <TableCell className="font-medium">{car.id}</TableCell>
              <TableCell>{car.model}</TableCell>
              <TableCell>{car.plate}</TableCell>
              <TableCell>{getCarTypeBadge(car.type)}</TableCell>
              <TableCell>{car.capacity}</TableCell>
              <TableCell>{getStatusBadge(car.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
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
