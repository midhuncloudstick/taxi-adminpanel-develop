
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Car, Upload } from "lucide-react";
// import { Car, cars } from "@/data/mockData";
import { Cars } from "@/types/fleet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { CreateDrivers, getDrivers } from "@/redux/Slice/driverSlice";
import { getCars } from "@/redux/Slice/fleetSlice";
import { useAppSelector } from "@/redux/hook";
import { drivers } from "@/data/mockData";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  licenceNumber: z.string().min(5, {
    message: "License number must be at least 5 characters.",
  }),
  carId: z.string().min(1, {
    message: "Please select a vehicle.",
  }),
  status: z.enum(["active", "inactive"]),
  photo: z.string().optional(),

  type:z.enum(["internal","external"]),

});

type FormValues = z.infer<typeof formSchema>;

interface AddDriverFormProps {
  onSuccess: () => void;
}

export function AddDriverForm({ onSuccess }: AddDriverFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [availableCars, setAvailableCars] = useState<Cars[]>([]);
  const dispatch = useDispatch<AppDispatch>()
  const vehicle = useAppSelector((state) => state.fleet.cars)
 const driver = useAppSelector((state)=>state.driver.drivers)
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  // Load cars when component mounts
  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);

  useEffect(() => {
    setAvailableCars(vehicle);
  }, [vehicle]);



  //   const form = useForm<FormValues>({
  //     resolver: zodResolver(formSchema),
  //     defaultValues: {
  //       name: "",
  //       email: "",
  //       phone: "",
  //       licenseNumber: "",
  //       carId: "",
  //       status: "active",
  //       photo: "",

  //     },

  //   });



  //   const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = event.target.files?.[0];
  //     if (!file) return;

  //     // In a real app, this would be an API call to upload the image
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (typeof reader.result === "string") {
  //         setPhotoPreview(reader.result);
  //         form.setValue("photo", reader.result);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   };

  //   const onSubmit = (values: FormValues) => {
  //     const formData = new FormData();
  //     formData.append("data", JSON.stringify(values));

  //     try {

  //       await dispatch(CreateDrivers({ data: formData })).unwrap();
  //       await dispatch(getDrivers())
  //       toast.success("Car created successfully");

  //       onSuccess();
  //       toast.success("New car added to fleet successfully");

  //       ({
  //         name: "",
  //         email: "",
  //         phone: "",
  //         licenseNumber: "",
  //         carId: "",
  //         status: "active",
  //         photo: "",
  //       });

  //       setIsOpen(false);
  //     } catch (error) {
  //       console.error("Create Car Error:", error);

  //       let errorMessage = "Failed to create Car";
  //       if (typeof error === "object" && error && "error" in error) {
  //         errorMessage = (error as any).error;
  //       } else if (typeof error === "string") {
  //         errorMessage = error;
  //       }

  //       toast.error(errorMessage);
  //     }
  //   };
  //   // In a real app, this would be an API call to save the driver
  //   console.log(values);

  //   toast.success("Driver added successfully");
  //   onSuccess();
  // };
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
      type:"internal",
    },
  });

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
    console.log("Form values:", values);


    if (!values.phone || !values.licenceNumber) {
      toast.error("Phone number and License number are required.");
      return;
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(values));

    try {

      await dispatch(CreateDrivers({ data: formData })).unwrap();
      await dispatch(getDrivers());

      toast.success("Driver added successfully");
      onSuccess();

      form.reset({
        name: "",
        email: "",
        phone: "",
        licenceNumber: "",
        carId: "",
        status: "active",
        photo: "",
        type:"internal",
      });

      setIsAddDriverOpen(false);
    } catch (error) {
      console.error("Create Driver Error:", error);

      let errorMessage = "Failed to create driver";
      if (typeof error === "object" && error && "error" in error) {
        errorMessage = (error as any).error;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast.error(errorMessage);
    }
  };

  return (
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Internal</SelectItem>
                  <SelectItem value="inactive">External</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onSuccess} type="button">
            Cancel
          </Button>
          <Button type="submit" className="bg-taxi-teal hover:bg-taxi-teal/90">
            Add Driver
          </Button>
        </div>
      </form>
    </Form>
  );
}

