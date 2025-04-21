
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FleetTable } from "@/components/fleet/FleetTable";
import { AddCarForm } from "@/components/fleet/AddCarForm";
import { Car } from "@/data/mockData";
import { toast } from "sonner";

export default function Fleet() {
  const handleAddCar = (car: Omit<Car, "id">) => {
    // In a real app, this would make an API call to add the car
    console.log("Adding new car:", car);
  };

  const handleEditCar = (car: Car) => {
    // In a real app, this would open an edit form
    toast.info(`Editing car ${car.id}`);
    console.log("Editing car:", car);
  };

  const handleDeleteCar = (carId: string) => {
    // In a real app, this would make an API call to delete the car
    toast.success(`Car ${carId} deleted successfully`);
    console.log("Deleting car:", carId);
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
      </div>
    </PageContainer>
  );
}
