import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { CreateDrivers, getDrivers } from "@/redux/Slice/driverSlice";
import { getCars } from "@/redux/Slice/fleetSlice";
import { useAppSelector } from "@/redux/hook";
import { Cars } from "@/types/fleet";

const cleanPhone = (val: string) => val.replace(/\s+/g, "");

const InternalDriverSchema = z.object({
  type: z.literal("internal"),
  name: z.string().min(8, "Full name must be at least 8 characters"),
  email: z.string().optional(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .transform(cleanPhone)
    .refine((val) => /^\+\d{1,4}\d{6,12}$/.test(val), {
      message: "Phone must start with country code (e.g., +61411392930)",
    }),
  licenceNumber: z.string().min(5, { message: "Invalid license number" }),
  carId: z.string().min(1, { message: "Please select a vehicle" }),
  status: z.enum(["active", "inactive"]),
  photo: z.string().optional(),
});

const ExternalDriverSchema = z.object({
  type: z.literal("external"),
  name: z.string().min(8, "Full name must be at least 8 characters"),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .transform(cleanPhone)
    .refine((val) => /^\+\d{1,4}\d{6,12}$/.test(val), {
      message: "Phone must start with country code (e.g., +61...)",
    }),
  licenceNumber: z.string().optional(),
  carId: z.string().min(1, { message: "Please select a vehicle" }),
  status: z.enum(["active", "inactive"]),
  photo: z.string().optional(),
});

const formSchema = z.discriminatedUnion("type", [
  InternalDriverSchema,
  ExternalDriverSchema,
]);

type FormValues = z.infer<typeof formSchema>;

interface AddDriverFormProps {
  onSuccess: () => void;
}

export function AddDriverForm({ onSuccess }: AddDriverFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableCars, setAvailableCars] = useState<Cars[]>([]);

  const vehicle = useAppSelector((state) => state.fleet.cars);
  const currentPage = useAppSelector((state) => state.fleet.page || 1);
  const limit = 10;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      licenceNumber: "",
      carId: "",
      status: "active",
      photo: "",
      type: "internal",
    },
  });

  const driverType = form.watch("type");

  useEffect(() => {
    dispatch(getCars({ page: currentPage, limit, search: "" }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (Array.isArray(vehicle)) {
      const filtered = vehicle.filter(
        (car) => car.status === "available" || car.status === "in-use"
      );
      setAvailableCars(filtered);
    }
  }, [vehicle]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    const input = document.getElementById("photo-upload") as HTMLInputElement;
    if (input) input.value = "";
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { photo, ...restValues } = values;
      const formData = new FormData();
      formData.append("data", JSON.stringify(restValues));
      if (photoFile) formData.append("photo", photoFile);

      await dispatch(CreateDrivers({ data: formData })).unwrap();
      await dispatch(getDrivers({ page: 1, limit: 10, search: "" }));

      toast.success("Driver added successfully");
      form.reset();
      setPhotoFile(null);
      setPhotoPreview(null);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to add driver");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        {/* PHOTO UPLOAD */}
        <div className="flex justify-center mb-6">
          <div className="relative space-y-2 flex flex-col items-center">
            <Avatar className="w-32 h-32 border-2 border-gray-200">
              {photoPreview ? (
                <AvatarImage src={photoPreview} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-gray-100 text-gray-400 text-xl">
                  <Upload className="w-12 h-12" />
                </AvatarFallback>
              )}
            </Avatar>
            {photoPreview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-black" />
              </button>
            )}
            <label
              htmlFor="photo-upload"
              className="cursor-pointer text-taxi-blue hover:text-taxi-teal text-sm underline"
            >
              {photoPreview ? "Change Photo" : "Upload Photo"}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        {/* FORM FIELDS */}
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl><Input placeholder="Driver's full name" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="Email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl><Input placeholder="+61 400 000 000" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="licenceNumber" render={({ field }) => (
            <FormItem>
              <FormLabel>License Number</FormLabel>
              <FormControl><Input placeholder="License" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {driverType === "internal" && (
            <FormField control={form.control} name="carId" render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Vehicle</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableCars.map((car) => (
                      <SelectItem key={car.id} value={car.id.toString()}>
                        {car.model} ({car.plate}) - {car.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          )}
        </div>

        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="type" render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                <FormItem className="flex items-center space-x-2">
                  <FormControl><RadioGroupItem value="internal" id="internal" /></FormControl>
                  <FormLabel htmlFor="internal">Internal</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl><RadioGroupItem value="external" id="external" /></FormControl>
                  <FormLabel htmlFor="external">External</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* ACTION BUTTONS */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-taxi-teal hover:bg-taxi-teal/90 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Driver"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
