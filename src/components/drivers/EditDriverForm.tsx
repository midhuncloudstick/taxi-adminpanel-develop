import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { Car } from "@/data/mockData";
import { Car as CarIcon, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Cars } from "@/types/fleet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getCars, Updatecars } from "@/redux/Slice/fleetSlice";
import { useParams } from "react-router-dom";
import { string, z } from "zod";
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
import { CreateDrivers, getDrivers, UpdateDrivers, updateDrivers } from "@/redux/Slice/driverSlice";
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
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
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
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
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
    setPhotoPreview(driver.photo || null);
  }
}, [driver, IsOpen, form]);

const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      setPhotoPreview(reader.result);
      form.setValue("photo", reader.result);
    }
  };
  reader.readAsDataURL(file);
};



const onSubmit = async (values: FormValues) => {
  if (!values.id) {
    toast.error("Driver ID is missing");
    return;
  }

  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
  formData.append(key, value as any);
});


  try {
    console.log("updated-driver",values)
   const result = await dispatch(UpdateDrivers({ driverId: values.id.toString(), data: formData }));
   console.log("Dispatch result:", result);

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

    setIsAddDriverOpen(false);
  } catch (error) {
    let errorMessage = "Failed to update driver";
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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Driver</DialogTitle>
                    <DialogDescription>Update the driver's information below.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <div className="flex justify-center mb-6">
                            <div className="space-y-2 flex flex-col items-center">
                                <Avatar className="w-32 h-32 border-2 border-gray-200">
                                    {photoPreview ? (
                                        <AvatarImage src={photoPreview} alt="Driver photo preview" />
                                    ) : (
                                        <AvatarFallback className="bg-gray-100 text-gray-400 text-xl">
                                            <Upload className="w-12 h-12" />
                                        </AvatarFallback>
                                    )}
                                </Avatar>
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
                                            <Input type="email" placeholder="Enter your email" {...field} />
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
                                                        {car.model} ({car.plate}) -{" "}
                                                        {car.type.charAt(0).toUpperCase() + car.type.slice(1)}
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                            <Button variant="outline" type="button" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-taxi-teal hover:bg-taxi-teal/90">
                                Save Driver
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
