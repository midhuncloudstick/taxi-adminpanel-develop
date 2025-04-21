
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "@/data/mockData";
import { Car as CarIcon, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AddCarFormProps {
  onAddCar: (car: Omit<Car, "id">) => void;
}

export function AddCarForm({ onAddCar }: AddCarFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Car, "id">>({
    model: "",
    plate: "",
    type: "sedan",
    capacity: 4,
    status: "available"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "capacity" ? parseInt(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCar(formData);
    toast.success("New car added to fleet successfully");
    setFormData({
      model: "",
      plate: "",
      type: "sedan",
      capacity: 4,
      status: "available"
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-taxi-teal hover:bg-taxi-teal/90">
          <Plus className="mr-2 h-4 w-4" /> Add New Car
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CarIcon className="h-5 w-5" />
            Add New Car to Fleet
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="model">Car Model</Label>
            <Input
              id="model"
              name="model"
              placeholder="e.g. Toyota Camry 2023"
              value={formData.model}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="plate">License Plate</Label>
            <Input
              id="plate"
              name="plate"
              placeholder="e.g. ABC-123"
              value={formData.plate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Car Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: "sedan" | "suv" | "luxury") => setFormData({...formData, type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select car type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="capacity">Passenger Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              max="12"
              value={formData.capacity}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: "available" | "in-use" | "maintenance") => setFormData({...formData, status: value as "available" | "in-use" | "maintenance"})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in-use">In Use</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="mt-2 bg-taxi-teal hover:bg-taxi-teal/90">
            Add Car to Fleet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
