
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner';
import { Users, Briefcase } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(4, "Address must be at least 4 characters"),
  specialRequest: z.string().optional(),
})

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle } = location.state || {};

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      specialRequest: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Booking submitted successfully!");
    // Here you would typically submit to your backend
    navigate('/');
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container-custom py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No Vehicle Selected</h2>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container-custom py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vehicle Summary Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Vehicle Selection</h2>
            <div className="bg-muted rounded-lg overflow-hidden shadow border border-primary/10">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 space-y-3">
                <h3 className="text-xl font-semibold mb-1">{vehicle.name}</h3>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" /> {vehicle.passengers} Passengers</span>
                  <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" /> {vehicle.luggage} Luggage</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span>{vehicle.kilometers} km included</span>
                  <span className="font-bold text-primary">${vehicle.price}</span>
                </div>
                <div>
                  <span className="font-semibold text-base">Features:</span>
                  <ul className="ml-4 list-disc text-sm mt-1">
                    {vehicle.features.map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street, City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialRequest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Request <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                      <FormControl>
                        <Textarea placeholder="E.g. Booster seat, pet policy or other requests" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Complete Booking
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetails;

