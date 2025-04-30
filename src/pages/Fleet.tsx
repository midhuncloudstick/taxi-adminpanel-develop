
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { FleetTable } from "@/components/fleet/FleetTable";
import { AddCarForm } from "@/components/fleet/AddCarForm";
import { EditCarForm } from "@/components/fleet/EditCarForm";
import { Car, cars } from "@/data/mockData";
import { toast } from "sonner";

export default function Fleet() {
  const [carsData, setCarsData] = useState<Car[]>(cars);
  const [carToEdit, setCarToEdit] = useState<Car | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const handleAddCar = (car: Omit<Car, "id">) => {
    // Generate a new ID for the car
    const newCarId = `CAR-${String(carsData.length + 1).padStart(3, '0')}`;
    const newCar = { ...car, id: newCarId };
    
    // Update the cars data state with the new car
    setCarsData([...carsData, newCar]);
    toast.success("New car added to fleet successfully");
  };

  const handleEditCar = (car: Car) => {
    setCarToEdit(car);
    setIsEditFormOpen(true);
  };

  const handleSaveEditedCar = (editedCar: Car) => {
    setCarsData(carsData.map(car => car.id === editedCar.id ? editedCar : car));
  };

  const handleDeleteCar = (carId: string) => {
    setCarsData(carsData.filter(car => car.id !== carId));
    toast.success(`Car ${carId} deleted successfully`);
  };

  return (
    <PageContainer title="Fleet Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-taxi-blue">Fleet Inventory</h2>
            <p className="text-sm text-gray-500">Manage all vehicles in your taxi fleet</p>
          </div>
          <AddCarForm onAddCar={handleAddCar} />
        </div>

        <Card>
          <CardContent className="pt-6">
            <FleetTable onEdit={handleEditCar} onDelete={handleDeleteCar} />
          </CardContent>
        </Card>
        
        <EditCarForm
          car={carToEdit}
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSave={handleSaveEditedCar}
        />
      </div>
    </PageContainer>
  );
}
