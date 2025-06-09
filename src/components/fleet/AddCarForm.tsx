import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car as CarIcon, Loader2, Plus, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Cars } from "@/types/fleet";
import { CreateCars, getCars } from "@/redux/Slice/fleetSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/redux/hook";

interface AddCarFormProps {
  onAddCar: (car: Omit<Cars, "id">) => void;
}

export function AddCarForm({ onAddCar }: AddCarFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]); // Store image previews (base64)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [loader, setLoader] = useState(false);
  const current_Page = useAppSelector((state) => state.booking.page || 1);
  const totalPages = useAppSelector((state) => state.booking.total_pages || 1);
  const [localPage, setLocalPage] = useState(current_Page);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 10;
  const [CarForm, setCarForm] = useState<Cars>({
    id: "",
    car_images: "",
    model: "",
    plate: "",
    type: "sedan",
    capacity: 4,
    status: "available",
    pricePerKm: 0,
    fixedCost: 0,
    description: "",
    small_bags: 0,
    large_bags: 0,
    add_trailer: false,
    created_at: new Date().toISOString(),
    features: [],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    files.forEach((file) => {
      // Check if image is landscape
      const img = new Image();
      img.onload = () => {
        if (img.width < img.height) {
          setImageFiles((prev) => [...prev, file]);
          setImages((prev) => [...prev, URL.createObjectURL(file)]);
        } else {
          toast.error("Please upload portrait-oriented images only");
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCarForm((prevForm) => ({
      ...prevForm,
      [name]:
        name === "capacity" || name === "small_bags" || name === "large_bags"
          ? parseInt(value)
          : name === "pricePerKm" || name === "fixedCost"
          ? parseFloat(value)
          : name === "add_trailer"
          ? value === "yes"
          : value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    if (value && index === features.length - 1 && features.length < 6) {
      setFeatures([...newFeatures, ""]);
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    const formattedFeatures = features
      .filter((f) => f.trim() !== "")
      .map((f) => ({ feature: f }));

    const { id, car_images, ...fieldsToSend } = {
      ...CarForm,
      features: formattedFeatures,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(fieldsToSend));

    imageFiles.forEach((file) => {
      formData.append("photo", file);
    });

    try {
      await dispatch(CreateCars({ data: formData })).unwrap();
      await dispatch(
        getCars({ page: current_Page, limit, search: searchQuery })
      );
      toast.success("Car created successfully");

      onAddCar({
        ...CarForm,
        features: features.filter((f) => f.trim() !== ""),
      });

      setCarForm({
        id: "",
        model: "",
        car_images: "",
        plate: "",
        type: "sedan",
        features: [],
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
      setImages([]);
      setImageFiles([]);
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
    } finally {
      setLoader(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-taxi-teal hover:bg-taxi-teal/90">
          <Plus className="mr-2 h-4 w-4" /> Add New Car
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CarIcon className="h-5 w-5" />
            Add New Car to Fleet
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label>Car Images (Portrait  only)</Label>
            <div className="flex flex-wrap gap-3">
              {/* Image previews */}
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <div className="w-32 h-24 rounded-md overflow-hidden border border-gray-200">
                    <img
                      src={img}
                      alt={`car preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-opacity opacity-0 group-hover:opacity-100"
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}

              {/* Upload button (only show if less than 5 images) */}
              {images.length < 5 && (
                <label className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {images.length}/5 images uploaded • Portrait orientation required
            </p>
          </div>

          {/* Form Grid - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
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
                  value={CarForm.capacity === 0 ? "" : CarForm.capacity} // Show empty string when 0
                  onChange={handleInputChange}
                  required
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Hide arrows
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="pricePerKm">Price Per Kilometer ($)</Label>
                <Input
                  id="pricePerKm"
                  name="pricePerKm"
                  type="number"
                  step="0.01"
                  min="0"
                  value={CarForm.pricePerKm === 0 ? "" : CarForm.pricePerKm}
                  onChange={handleInputChange}
                  required
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                  value={CarForm.fixedCost === 0 ? "" : CarForm.fixedCost}
                  onChange={handleInputChange}
                  required
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="small_bags">Small Luggage</Label>
                <Input
                  id="small_bags"
                  name="small_bags"
                  type="number"
                  min="0"
                  value={CarForm.small_bags === 0 ? "" : CarForm.small_bags}
                  onChange={handleInputChange}
                  required
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="large_bags">Large Luggage</Label>
                <Input
                  id="large_bags"
                  name="large_bags"
                  type="number"
                  min="0"
                  value={CarForm.large_bags === 0 ? "" : CarForm.large_bags}
                  onChange={handleInputChange}
                  required
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Full-width elements */}
          <div className="grid gap-2">
            <Label htmlFor="add_trailer">Trailer Available</Label>
            <Select
              value={CarForm.add_trailer ? "yes" : "no"}
              onValueChange={(value: "yes" | "no") => {
                setCarForm({ ...CarForm, add_trailer: value === "yes" });
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
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {features.length >= 6 && (
              <p className="text-sm text-muted-foreground">
                Maximum 6 features reached
              </p>
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

          <Button
            type="submit"
            disabled={loader}
            className="mt-2 bg-taxi-teal hover:bg-taxi-teal/90 flex gap-2"
          >
            {loader && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Car to Fleet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
