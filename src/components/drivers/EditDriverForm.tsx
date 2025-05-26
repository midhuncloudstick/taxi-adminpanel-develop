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
import { useParams } from "react-router-dom";
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
    driver: Drivers | null; // Driver object, not Car
    IsOpen: boolean;
    onClose: () => void;
    onSave: (drivers: Drivers) => void;
    onSuccess: () => void;
}


const InternalDriverSchema = z.object({
    id: z.number(),
    type: z.literal("internal"),
    name: z.string().min(2, { message: "Name must be at least 8 characters." }),
    email: z.string().optional(),
    phone: z.string().min(10, { message: "Please enter a valid phone number." }),
    licenceNumber: z.string().min(5, { message: "Please enter a valid license number." }),
    carId: z.string().min(1, { message: "Please select a vehicle." }),
    status: z.enum(["active", "inactive"]),
    photo: z.string().optional(),
});

const ExternalDriverSchema = z.object({
    id: z.number(),
    type: z.literal("external"),
    name: z.string().min(2, { message: "Name must be at least 8 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().optional(),
    licenceNumber: z.string().optional(),
    carId: z.string().min(1, { message: "Please select a vehicle." }),
    status: z.enum(["active", "inactive"]),
    photo: z.string().optional(),
});

export const formSchema = z.discriminatedUnion("type", [
    InternalDriverSchema,
    ExternalDriverSchema,
]);



type FormValues = z.infer<typeof formSchema>;

export function EditDriverForm({ driver, IsOpen, onClose, onSave, onSuccess }: EditCarFormProps) {
    const vehicle = useAppSelector((state) => state.fleet.cars);
    const dispatch = useDispatch<AppDispatch>();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [availableCars, setAvailableCars] = useState<Cars[]>([]);
    const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [photoFile, setPhotoFile] = useState<File | null>(null); 
    


    useEffect(() => {
        dispatch(getCars());
    }, [dispatch]);

    useEffect(() => {
        setAvailableCars(vehicle);
    }, [vehicle]);


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: driver.id,
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
           setPhotoPreview(
      driver.photo
        ? driver.photo.startsWith("http")
          ? driver.photo
          : `http://139.84.156.137:8080/${driver.photo.replace(/^\/+/, '')}`
        : null
    );
  }
}, [driver, IsOpen, form]);

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
        rest.photo = "";
        formData.append("data", JSON.stringify(rest));

        try {
            const result = await dispatch(
                UpdateDrivers({
                    driverId: values.id.toString(),
                    data: formData
                })
            ).unwrap(); // Important for proper error handling

            await dispatch(getDrivers());
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
            setIsAddDriverOpen(false);
        } catch (error: unknown) { // Type-safe error handling
            let errorMessage = "Failed to update driver";

            if (typeof error === "object" && error !== null) {
                // Type-safe property access
                if ('error' in error && typeof (error as { error: unknown }).error === "string") {
                    errorMessage = (error as { error: string }).error;
                } else if ('message' in error && typeof (error as { message: unknown }).message === "string") {
                    errorMessage = (error as { message: string }).message;
                }
            } else if (typeof error === "string") {
                errorMessage = error;
            }

            toast.error(errorMessage);
            console.error("Update failed:", error);
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
                                            <AvatarImage src={photoPreview} alt="Driver photo preview" />
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
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex flex-row items-center gap-6"
                                        >
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="internal" id="type-internal" />
                                                </FormControl>
                                                <FormLabel htmlFor="type-internal" className="font-normal">
                                                    Internal
                                                </FormLabel>
                                            </FormItem>

                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="external" id="type-external" />
                                                </FormControl>
                                                <FormLabel htmlFor="type-external" className="font-normal">
                                                    External
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2 pt-4">
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
