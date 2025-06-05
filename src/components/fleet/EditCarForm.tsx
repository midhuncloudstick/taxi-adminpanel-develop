
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
  const [images, setImages] = useState<string[]>([]); // Store image previews (base64)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
    const current_Page = useAppSelector((state) => state.booking.page || 1);
    const totalPages = useAppSelector((state) => state.booking.total_pages || 1);
    const [localPage, setLocalPage] = useState(current_Page);
    const [searchQuery, setSearchQuery ] = useState("");
    const limit= 10

useEffect(() => {
  if (car) {
    setCarForm({
      ...car,
      created_at: car.created_at || new Date().toISOString(),
    });
    setFeatures(
      Array.isArray(car.features)
        ? car.features.map(f => typeof f === "string" ? f : f.feature)
        : [""]
    );
    // Handle car_images as array of objects with image_url
    if (Array.isArray(car.car_images) && car.car_images.length > 0) {
      const baseUrl = "https://brisbane.cloudhousetechnologies.com";
      setImages(
        car.car_images
          .map(imgObj =>
            imgObj && imgObj.image_url
              ? imgObj.image_url.startsWith("https")
                ? imgObj.image_url
                : `${baseUrl}${imgObj.image_url}`
              : ""
          )
          .filter(Boolean)
      );
    } else {
      setImages([]);
    }
    setImageFiles([]);
  }
}, [car, IsOpen]);

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
    features: [],
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImageFiles = Array.from(files);
    const newImages = newImageFiles.map((file) => URL.createObjectURL(file));

    setImages((prevImages) => [...prevImages, ...newImages]);
    setImageFiles((prevFiles) => [...prevFiles, ...newImageFiles]);

    // Reset the input value so the same file can be selected again if needed
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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

    const formattedFeatures = features
      .filter(f => f.trim() !== "")
      .map(f => ({ feature: f }));

    // Prepare form fields, remove id and car_images if not needed
    const { id, car_images, ...fieldsToSend } = {
      ...CarForm,
      features: formattedFeatures
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(fieldsToSend));

    imageFiles.forEach((file) => {
      formData.append("photo", file);
    });

    try {
      console.log("carsss", CarForm)
      await dispatch(Updatecars({ carId: CarForm.id, data: formData })).unwrap();
      await dispatch(getCars({page:current_Page,limit,search:searchQuery}))
      toast.success("Car created successfully");

      onSave(CarForm);
      toast.success("Updated car added to fleet successfully");

      setCarForm({
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
        features: [],
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
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <Avatar className="w-20 h-20 border-2 border-gray-200">
                  <AvatarImage src={img} alt={`car image ${idx + 1}`} />
                  <AvatarFallback className="bg-gray-100 text-gray-400 text-xl">
                    <Upload className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  onClick={() => handleRemoveImage(idx)}
                >
                  <X className="w-4 h-4 text-black-500" />
                </button>
              </div>
            ))}

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
              onChange={handleImageChange}
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
              onValueChange={(value: "available" | "in-use" | "maintenance" ) =>
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
                {/* <SelectItem value="cancelled">Cancelled</SelectItem> */}
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
