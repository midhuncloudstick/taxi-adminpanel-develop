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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Car, Upload, Loader, X, Loader2 } from "lucide-react";
// import { Car, cars } from "@/data/mockData";
import { Cars } from "@/types/fleet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { CreateDrivers, getDrivers } from "@/redux/Slice/driverSlice";
import { getCars } from "@/redux/Slice/fleetSlice";
import { useAppSelector } from "@/redux/hook";
import { drivers } from "@/data/mockData";



const InternalDriverSchema = z.object({
  id: z.number(),
  type: z.literal("internal"),
  name: z.string().min(2, { message: "Name must be at least 8 characters." }),
  email: z.string().optional(),
  phone: z
    .string()
    .transform(val => val.replace(/\s+/g, '')) // Remove all spaces
    .pipe(
      z.string().regex(/^\+\d{1,4}\d{6,12}$/, {
        message: "Phone number must start with country code (e.g., +61411392930)",
      })
    ),
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
  phone: z
    .string()
    .transform(val => val.replace(/\s+/g, '')) // Remove all spaces
    .refine(val => /^\+\d{1,4}\d{6,12}$/.test(val), {
      message: "Phone number must start with country code (e.g., +61) and be valid.",
    }),
  licenceNumber: z.string().optional(),
  carId: z.string().min(1, { message: "Please select a vehicle." }),
  status: z.enum(["active", "inactive"]),
  photo: z.string().optional(),
});

// Discriminated union for single driver
export const formSchema = z.discriminatedUnion("type", [
  InternalDriverSchema,
  ExternalDriverSchema,
]);

// Validate an array of drivers and check for unique phone and licenceNumber
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
            message: "email  must be unique.",
          });
        } else {
          emailSet.add(driver.email);
        }
      }
    });
  });


type FormValues = z.infer<typeof formSchema>;

interface AddDriverFormProps {
  onSuccess: () => void;
}

export function AddDriverForm({ onSuccess }: AddDriverFormProps) {
 
  
  const dispatch = useDispatch<AppDispatch>()
  const vehicle = useAppSelector((state) => state.fleet.cars)
  const driver = useAppSelector((state) => state.driver.drivers)
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
const [photoPreview, setPhotoPreview] = useState<string | null>(null);
const [photoFile, setPhotoFile] = useState<File | null>(null); 
    const current_Page = useAppSelector((state) => state.booking.page || 1);
    const totalPages = useAppSelector((state) => state.booking.total_pages || 1);
    const [localPage, setLocalPage] = useState(current_Page);
    const [searchQuery, setSearchQuery ] = useState("");
    const limit= 10
const [availableCars, setAvailableCars] = useState([]);

useEffect(() => {
  const filteredCars = vehicle.filter(
    (car) => car.status === 'available' || car.status === 'in-use'
  );
  setAvailableCars(filteredCars);
}, [vehicle]);




  
 
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
  if (!values.phone || !values.licenceNumber) {
    toast.error("Phone number and License number are required.");
    return;
  }

  setIsLoading(true);

  const formData = new FormData();
  formData.append("data", JSON.stringify(values));

  if (photoFile) {
    formData.append("photo", photoFile); 
  }

try {
  await dispatch(CreateDrivers({ data: formData })).unwrap();
  await dispatch(getDrivers({page:current_Page,limit, search:searchQuery})); 

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
    type: "internal",
  });

  setPhotoFile(null);
  setPhotoPreview(null);
  setIsAddDriverOpen(false);
  } catch (error) {
    console.error("Create Driver Error:", error);

    let errorMessage = "Failed to create driver";
    if ('error' in error && typeof (error as { error: unknown }).error === "string") {
      errorMessage = (error as { error: string }).error;
    } else if ('message' in error && typeof (error as { message: unknown }).message === "string") {
      errorMessage = (error as { message: string }).message;
    }

    toast.error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
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
            className={`flex items-center gap-2
                ${isLoading
                ? 'bg-gray-400 cursor-not-allowed opacity-75'
                : 'bg-taxi-teal hover:bg-taxi-teal/90'
              }
           transition-all duration-200`}
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
  );
}

