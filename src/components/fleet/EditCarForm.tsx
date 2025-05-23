
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "@/data/mockData";
import { Car as CarIcon, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Cars } from "@/types/fleet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getCars, Updatecars } from "@/redux/Slice/fleetSlice";
import { useParams } from "react-router-dom";
import { string } from "zod";
import { useAppSelector } from "@/redux/hook";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface EditCarFormProps {
  car: Cars | null; // not Car
  IsOpen: boolean;
  onClose: () => void;
  onSave: (car: Cars) => void;
}


export function EditCarForm({ car, IsOpen, onClose, onSave }: EditCarFormProps) {
  console.log("Editing car:", car);
  // const [isOpen, setIsOpen] = useState(false);
  // const { carId } = useParams<{ carId: string }>();
  const vehicle = useAppSelector((state) => state.fleet.cars)
  const dispatch = useDispatch<AppDispatch>()
  const [features, setFeatures] = useState<string[]>([""]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
const [photoFile, setPhotoFile] = useState<File | null>(null); 

  useEffect(() => {
    if (car && IsOpen) {
      setCarForm((prev) => ({
        ...prev,
        ...car,
      }));

      // 🟢 Parse car.features string into an array for inputs
      const parsedFeatures =
        typeof car.features === "string"
          ? car.features.split(",").map((f) => f.trim()).filter(Boolean)
          : [];

      // 🟢 Always leave one empty string for adding new features
      setFeatures(parsedFeatures.length ? [...parsedFeatures, ""] : [""]);
    }
  }, [car, IsOpen]);




  const [CarForm, setCarForm] = useState<Cars>({


    id: "",
    car_images:"",
    model: "",
    plate: "",
    type: "sedan",
    capacity: 4,
    status: "available",
    pricePerKm: 0,
    fixedCost: 0,
    features: "",
    description: "",
    small_bags: 0,
    large_bags: 0,
    add_trailer: false,
    created_at: new Date().toISOString(),
  });

  // Set form data when car changes

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

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoFile(file); // store actual file

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoPreview(reader.result); // preview only
      }
    };
    reader.readAsDataURL(file); // still needed for preview
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null); // clear the file

    const input = document.getElementById("photo-upload") as HTMLInputElement | null;
    if (input) input.value = ""; // reset the input field
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setCarForm((prevForm) => ({
      ...prevForm,
      [name]:
        name === "capacity" ||
          name === "small_bags" ||
          name === "large_bags"
          ? parseInt(value)
          : name === "pricePerKm" || name === "fixedCost"
            ? parseFloat(value)
            : name === "add_trailer"
              ? value === "yes" // Convert string to boolean for trailer
              : value,
    }));
  };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("data", JSON.stringify(CarForm));

    try {
      console.log("carsss", CarForm)
      await dispatch(Updatecars({ carId: CarForm.id, data: formData })).unwrap();
      await dispatch(getCars())
      toast.success("Car created successfully");

      onSave(CarForm);
      toast.success("Updated car added to fleet successfully");

      setCarForm({
        id: "",
        car_images:"",
        model: "",
        plate: "",
        type: "sedan",
        capacity: 4,
        status: "available",
        pricePerKm: 0,
        fixedCost: 0,
        description: "",
        small_bags: 0,
        features: "",
        large_bags: 0,
        add_trailer: false,
        created_at: new Date().toISOString(),
      });

      onClose();
    } catch (error) {
      console.error("Upadte Car Error:", error);

      let errorMessage = "Failed update Car details";
      if (typeof error === "object" && error && "error" in error) {
        errorMessage = (error as any).error;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast.error(errorMessage);
    }
  };

  return (
   <Dialog open={IsOpen} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <CarIcon className="h-5 w-5" />
        Edit Car Details
      </DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
         <div className="relative space-y-2 flex flex-col items-center">
            <div className="relative">
              <Avatar className="w-32 h-32 border-2 border-gray-200">
                {photoPreview ? (
                  <AvatarImage src={photoPreview} alt="Car photo preview" />
                ) : (
                  <AvatarFallback className="bg-gray-100 text-gray-400 text-xl">
                    <Upload className="w-12 h-12" />
                  </AvatarFallback>
                )}
              </Avatar>

              {photoPreview && (
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  onClick={handleRemovePhoto}
                >
                  <X className="w-4 h-4 text-black-500" />
                </button>
              )}
            </div>

            <label
              htmlFor="photo-upload"
              className="cursor-pointer text-taxi-blue hover:text-taxi-teal text-sm underline"
            >
              Upload Photo
            </label>

            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
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
        <Label htmlFor="small_bags">Small Luggage</Label>
        <Input
          id="small_bags"
          name="small_bags"
          type="number"
          value={CarForm.small_bags || 0}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="large_bags">Large Luggage</Label>
        <Input
          id="large_bags"
          name="large_bags"
          type="number"
          value={CarForm.large_bags || 0}
          onChange={handleInputChange}
          required
        />
      </div>

      <Label htmlFor="add_trailer">Trailer</Label>
      <Select
        value={CarForm.add_trailer ? "yes" : "no"} // Convert boolean to string for select value
        onValueChange={(value: "yes" | "no") => {
          setCarForm({ ...CarForm, add_trailer: value === "yes" }); // Convert string back to boolean
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select trailer option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no">No</SelectItem>
          <SelectItem value="yes">Yes</SelectItem>
        </SelectContent>
      </Select>

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
                className="text-red-500 hover:text-black-700"
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
            setCarForm({ ...CarForm, status: value as "available" | "in-use" | "maintenance" })
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

      <div className="flex justify-end gap-2 mt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-taxi-teal hover:bg-taxi-teal/90">
          Save Changes
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

  );
}
