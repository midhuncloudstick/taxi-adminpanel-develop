import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { Car } from "@/data/mockData";
import { Car as CarIcon, Upload, Loader, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Cars } from "@/types/fleet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getCars, Updatecars } from "@/redux/Slice/fleetSlice";
import { Search, useParams } from "react-router-dom";
import { string } from "zod";
import { useAppSelector } from "@/redux/hook";
import { Textarea } from "../ui/textarea";
import { Drivers } from "@/types/driver";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CreateDrivers, getDrivers, UpdateDrivers } from "@/redux/Slice/driverSlice";
import { DialogDescription } from "@radix-ui/react-dialog";

interface EditCarFormProps {
    driver: Drivers | null;
    IsOpen: boolean;
    onClose: () => void;
    onSave: (drivers: Drivers) => void;
    onSuccess: () => void;
    currentPage: number;
    searchQuery: string;
}

const cleanPhone = (val: string) => val.replace(/\s+/gu, '');

const InternalDriverSchema = z.object({
  id: z.number(),
  type: z.literal("internal"),
  name: z.string().min(8, ),
  email: z.string().optional(),
  phone: z
    .string()
    .transform(cleanPhone)
    .refine(val => /^\+\d{1,4}\d{6,12}$/.test(val), {
      message: "Phone number must start with country code (e.g., +61411392930)",
    }),
  licenceNumber: z.string().min(5, { message: "Please enter a valid license number." }),
  carId: z.string().min(1, { message: "Please select a vehicle." }),
  status: z.enum(["active", "inactive"]),
  photo: z.string().optional(),
});

const ExternalDriverSchema = z.object({
  id: z.number(),
  type: z.literal("external"),
  name: z.string().min(8, ),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .transform(cleanPhone)
    .refine(val => /^\+\d{1,4}\d{6,12}$/.test(val), {
      message: "Phone number must start with country code (e.g., +61) and be valid.",
    }),
  licenceNumber: z.string().optional(),
  carId: z.string().min(1, { message: "Please select a vehicle." }),
  status: z.enum(["active", "inactive"]),
  photo: z.string().optional(),
});

export const formSchema = z.discriminatedUnion("type", [
  InternalDriverSchema,
  ExternalDriverSchema,
]);

export const DriversArraySchema = z
  .array(formSchema)
  .superRefine((drivers, ctx) => {
    const phoneSet = new Set<string>();
    const licenceSet = new Set<string>();
    const emailSet = new Set<String>();
    drivers.forEach((driver, i) => {
      if (phoneSet.has(driver.phone)) {
        ctx.addIssue({
          path: [i, "phone"],
          code: z.ZodIssueCode.custom,
          message: "Phone number must be unique.",
        });
      } else {
        phoneSet.add(driver.phone);
      }

      if (driver.licenceNumber) {
        if (licenceSet.has(driver.licenceNumber)) {
          ctx.addIssue({
            path: [i, "licenceNumber"],
            code: z.ZodIssueCode.custom,
            message: "License number must be unique.",
          });
        } else {
          licenceSet.add(driver.licenceNumber);
        }
      }

       if (driver.email) {
        if (emailSet.has(driver.email)) {
          ctx.addIssue({
            path: [i, "email"],
            code: z.ZodIssueCode.custom,
            message: "email must be unique.",
          });
        } else {
          emailSet.add(driver.email);
        }
      }
    });
  });

type FormValues = z.infer<typeof formSchema>;

export function EditDriverForm({ driver, IsOpen, onClose, onSave, onSuccess, currentPage, searchQuery }: EditCarFormProps) {
    const vehicle = useAppSelector((state) => state.fleet.cars);
    const dispatch = useDispatch<AppDispatch>();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [availableCars, setAvailableCars] = useState<Cars[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null); 
    const current_Page = useAppSelector((state) => state.fleet.page || 1);
    const totalPages = useAppSelector((state) => state.fleet.total_pages || 1);
    const limit = 10;

    useEffect(()=>{
        dispatch(getCars({page:current_Page,limit:limit, search:searchQuery}))
    },[])

    useEffect(() => {
      if (Array.isArray(vehicle)) {
        const filteredCars = vehicle.filter(
          (car) => car.status === 'available' || car.status === 'in-use'
        );
        setAvailableCars(filteredCars);
      } else {
        setAvailableCars([]);
      }
    }, [vehicle]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: driver?.id || 0,
            name: driver?.name || "",
            email: driver?.email || "",
            phone: driver?.phone || "",
            licenceNumber: driver?.licenceNumber || "",
            carId: driver?.carId || "",
            status: driver?.status || "active",
            photo: driver?.photo || "",
            type: driver?.type || "internal",
        },
    });
const driverType = form.watch("type");

    useEffect(() => {
        if (driver && IsOpen) {
            form.reset({
                id: driver.id,
                name: driver.name,
                email: driver.email,
                phone: driver.phone,
                licenceNumber: driver.licenceNumber,
                carId: driver.carId,
                status: driver.status,
                photo: driver.photo,
                type: driver.type,
            });

            // Improved photo handling
            if (driver.photo) {
                // Check if photo is already a full URL
                if (driver.photo.startsWith('http')) {
                    setPhotoPreview(driver.photo);
                } else {
                    // Construct full URL from relative path
                    const cleanedPath = driver.photo.replace(/^\/+/, '');
                    const baseUrl = 'https://brisbane.cloudhousetechnologies.com';
                    setPhotoPreview(`${baseUrl}/${cleanedPath}`);
                }
            } else {
                setPhotoPreview(null);
            }
        }
    }, [driver, IsOpen, form]);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            toast.error('Please select an image file');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setPhotoFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setPhotoPreview(reader.result);
                form.setValue("photo", reader.result, {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        setPhotoFile(null);
        const input = document.getElementById("photo-upload") as HTMLInputElement | null;
        if (input) input.value = "";
        form.setValue("photo", "", {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const onSubmit = async (values: FormValues) => {
        if (!values.id) {
            toast.error("Driver ID is missing");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        let { id, ...rest } = values;
        
        // Handle photo upload
        if (photoFile) {
            formData.append("photo", photoFile);
        } else if (values.photo && values.photo.startsWith('data:')) {
            // If it's a data URL from a new upload
            const blob = await fetch(values.photo).then(r => r.blob());
            formData.append("photo", blob, 'driver-photo.jpg');
        }
        
        // Add other form data
        rest.photo = ""; // Clear photo field as we're handling it separately
        formData.append("data", JSON.stringify(rest));

        try {
            const result = await dispatch(
                UpdateDrivers({
                    driverId: values.id.toString(),
                    data: formData
                })
            ).unwrap();

            await dispatch(getDrivers({
                page: current_Page,
                limit,
                search: searchQuery
            }));

            toast.success("Driver updated successfully");
            onSuccess();

            form.reset({
                id: 0,
                name: "",
                email: "",
                phone: "",
                licenceNumber: "",
                carId: "",
                status: "active",
                photo: "",
                type: "internal",
            });
            setPhotoFile(null);
            setPhotoPreview(null);
            onClose();
        } catch (error: unknown) {
            toast.error("Failed to update driver");
            console.error("Update driver error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={IsOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Driver</DialogTitle>
                    <DialogDescription>Update the driver's information below.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <div className="flex justify-center mb-6">
                            <div className="relative space-y-2 flex flex-col items-center">
                                <div className="relative">
                                    <Avatar className="w-32 h-32 border-2 border-gray-200">
                                        {photoPreview ? (
                                            <AvatarImage 
                                                src={photoPreview} 
                                                alt="Driver photo preview"
                                                className="object-cover w-full h-full"
                                            />
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

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Enter you email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+61 400 000 000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="licenceNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Driver's License</FormLabel>
                                        <FormControl>
                                            <Input placeholder="License number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="carId"
                                render={({ field }) => (
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
                                                        {car.model} ({car.plate}) - {car.type.charAt(0).toUpperCase() + car.type.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select driver status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                      

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className={`
                                    flex items-center gap-2
                                    ${isLoading
                                        ? 'bg-gray-400 cursor-not-allowed opacity-75'
                                        : 'bg-taxi-teal hover:bg-taxi-teal/90'
                                    }
                                    transition-all duration-200
                                `}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    'Save Driver'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}