
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "@/data/mockData";
import { Car as CarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface EditCarFormProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (car: Car) => void;
}

export function EditCarForm({ car, isOpen, onClose, onSave }: EditCarFormProps) {
  const [formData, setFormData] = useState<Car>({
    id: "",
    model: "",
    plate: "",
    type: "sedan",
    capacity: 4,
    status: "available",
    pricePerKm: 0,
    fixedCost: 0
  });

  // Set form data when car changes
  useEffect(() => {
    if (car) {
      setFormData({
        ...car,
        pricePerKm: car.pricePerKm || 0,
        fixedCost: car.fixedCost || 0
      });
    }
  }, [car]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle different input types
    if (name === "capacity") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else if (name === "pricePerKm" || name === "fixedCost") {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(`Car ${formData.id} updated successfully`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CarIcon className="h-5 w-5" />
            Edit Car Details
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
            <Label htmlFor="pricePerKm">Price Per Kilometer ($)</Label>
            <Input
              id="pricePerKm"
              name="pricePerKm"
              type="number"
              step="0.01"
              min="0"
              value={formData.pricePerKm || 0}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="fixedCost">Fixed Cost ($)</Label>
            <Input
              id="fixedCost"
              name="fixedCost"
              type="number"
              step="0.01"
              min="0"
              value={formData.fixedCost || 0}
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
          
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-taxi-teal hover:bg-taxi-teal/90">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
