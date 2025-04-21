
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
import { Users, Briefcase, Check, Calendar, MapPin, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <main className="flex-grow container-custom py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Complete Your Booking</h1>
          
          {/* Booking Progress Indicator */}
          <div className="mb-10">
            <div className="w-full bg-muted h-2 rounded-full">
              <div className="bg-primary h-2 rounded-full w-2/3"></div>
            </div>
            <div className="flex justify-between text-sm mt-2 text-muted-foreground">
              <span>Vehicle Selection</span>
              <span className="font-medium text-primary">Customer Details</span>
              <span>Confirmation</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Vehicle Summary Section */}
            <div className="md:col-span-5">
              <Card className="border-primary/20 h-full flex flex-col">
                <CardHeader className="bg-muted/30 border-b border-border">
                  <CardTitle className="text-xl">Your Vehicle Selection</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow flex flex-col">
                  <div className="w-full h-56 overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-6 space-y-5 flex-grow">
                    <div className="border-b border-border pb-4">
                      <h3 className="text-xl font-semibold">{vehicle.name}</h3>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{vehicle.passengers} Passengers</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Briefcase className="h-4 w-4 mr-2" />
                          <span>{vehicle.luggage} Luggage</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{vehicle.kilometers} km included</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 border-b border-border pb-4">
                      <h4 className="font-medium">Features</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {vehicle.features.map((feature: string, i: number) => (
                          <div key={i} className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-muted-foreground">Total Price:</span>
                      <span className="font-bold text-xl text-primary">${vehicle.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Details Form */}
            <div className="md:col-span-7">
              <Card className="h-full">
                <CardHeader className="bg-muted/30 border-b border-border">
                  <CardTitle className="text-xl">Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      </div>
                      
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
                            <FormLabel>
                              Special Request <span className="text-muted-foreground text-xs">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="E.g. Booster seat, pet policy or other requests" 
                                {...field}
                                className="min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4">
                        <Button type="submit" className="w-full h-12 text-base">
                          Complete Booking
                        </Button>
                        <p className="text-center text-sm text-muted-foreground mt-4">
                          Your information is secure and will only be used for this booking.
                        </p>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetails;
