import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car as CarIcon, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Cars } from "@/types/fleet";
import { CreateCars, getCars } from "@/redux/Slice/fleetSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Textarea } from "../ui/textarea";

interface AddCarFormProps {
  onAddCar: (car: Omit<Cars, "id">) => void;
}

export function AddCarForm({ onAddCar }: AddCarFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [features, setFeatures] = useState<string[]>([""]); 
  const [CarForm, setCarForm] = useState<Cars>({
    id: "",
    model: "",
    plate: "",
    type: "sedan",
    capacity: 4,
    features: "",
    status: "available",
    pricePerKm: 0,
    fixedCost: 0,
    description: "",
    small_bags: 0,
    large_bags: 0,
    add_trailer: false,
    created_at: new Date().toISOString(),
  });

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);

    // Add new empty field if current field is filled and it's the last one
    if (value && index === features.length - 1 && features.length < 6) {
      setFeatures([...newFeatures, ""]);
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "capacity") {
      setCarForm({ ...CarForm, [name]: parseInt(value) });
    } else if (name === "pricePerKm" || name === "fixedCost") {
      setCarForm({ ...CarForm, [name]: parseFloat(value) });
    } else {
      setCarForm({ ...CarForm, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty features and join with comma
    const formattedFeatures = features.filter(f => f.trim() !== "").join(", ");
    const formData = new FormData();
    formData.append("data", JSON.stringify({
      ...CarForm,
      features: formattedFeatures
    }));

    try {
      await dispatch(CreateCars({ data: formData })).unwrap();
      await dispatch(getCars());
      toast.success("Car created successfully");

      onAddCar({
        ...CarForm,
        features: formattedFeatures
      });

      // Reset form
      setCarForm({
        id: "",
        model: "",
        plate: "",
        type: "sedan",
        features: "",
        capacity: 4,
        status: "available",
        pricePerKm: 0,
        fixedCost: 0,
        description: "",
        small_bags: 0,
        large_bags: 0,
        add_trailer: false,
        created_at: new Date().toISOString(),
      });
      setFeatures([""]);
      setIsOpen(false);
    } catch (error) {
      console.error("Create Car Error:", error);
      let errorMessage = "Failed to create Car";
      if (typeof error === "object" && error && "error" in error) {
        errorMessage = (error as any).error;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      toast.error(errorMessage);
    }
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
              value={CarForm.model}
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
              value={CarForm.plate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Car Type</Label>
            <Select
              value={CarForm.type}
              onValueChange={(value: "sedan" | "suv" | "luxury") =>
                setCarForm({ ...CarForm, type: value })
              }
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
              value={CarForm.capacity}
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
              value={CarForm.pricePerKm || 0}
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
              step="1"
              min="0"
              value={CarForm.fixedCost || 0}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              value={CarForm.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label>Features (Max 6)</Label>
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  id={`feature-${index}`}
                  name={`feature-${index}`}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-black-500 hover:text-black-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {features.length >= 6 && (
              <p className="text-sm text-muted-foreground">Maximum 6 features reached</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={CarForm.status}
              onValueChange={(value: "available" | "in-use" | "maintenance") =>
                setCarForm({ ...CarForm, status: value })
              }
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