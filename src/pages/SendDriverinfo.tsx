import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, User, Phone, MapPin, ArrowRight, CheckCircle2, RotateCw, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { getdriverinfo } from "@/redux/Slice/formSlice";
import { useParams } from "react-router-dom";
import { getBookingById } from "@/redux/Slice/bookingSlice";
import { useAppSelector } from "@/redux/hook";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SendDriverinfo() {
    const [driverName, setDriverName] = useState("");
    const [driverContact, setDriverContact] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { toast } = useToast();
    const dispatch = useDispatch<AppDispatch>();
    const { bookingid } = useParams();
    const booking = useAppSelector((state) => state.booking.singleBooking);

    useEffect(() => {
        if (bookingid) {
            dispatch(getBookingById({ bookingid }));
        }
    }, [dispatch, bookingid]);

    const handleSend = async () => {
        if (!driverName.trim() || !driverContact.trim()) {
            toast({
                title: "Error",
                description: "Please fill in both driver name and contact",
                variant: "destructive",
            });
            return;
        }

        if (!/^\+\d{1,4}\d{6,12}$/.test(driverContact.trim())) {
            toast({
                title: "Error",
                description: "Phone number must start with country code (e.g., +61) and be valid.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const resultAction = await dispatch(getdriverinfo({
                venderdriver_name: driverName,
                venderdriver_phone: driverContact,
                bookingId: bookingid || ""
            }));

            if (getdriverinfo.fulfilled.match(resultAction)) {
                toast({
                    title: "Success",
                    description: "Driver information sent successfully!",
                });
                setIsSent(true);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to send driver information",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md overflow-hidden shadow-lg rounded-xl border border-gray-200">
                {/* Header with gradient background */}
                <CardHeader className="bg-taxi-blue text-white p-6 text-center">
                    <div className="flex flex-col space-y-2">
                        {/* Heading Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            {/* Main Title */}
                            <CardTitle className="text-3xl font-bold font-serif flex space-x-2">
                                <span className="text-yellow-300">Brisbane</span>
                                <span className="text-white">Premium Transfer</span>
                            </CardTitle>

                            {/* Booking ID (on the right for large screens) */}

                        </div>

                        {/* Subheading */}
                        <h2 className="text-white  font-semibold">
                            Driver Information
                        </h2>

                        {/* Description */}
                        <CardDescription className="text-blue-100">
                            Share driver details with customer
                        </CardDescription>
                    </div>

                    {/* {booking && (
                        <Badge
                            variant="secondary"
                            className="text-xs font-mono py-1 mt-1 self-start text-center"
                        >
                            Booking ID: {booking.id || "N/A"}
                        </Badge>
                    )} */}
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {/* Booking Information */}
                    {booking && (
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h1 className="font-medium text-gray-500 text-center">
                               
                                Booking ID: {booking.id}
                            </h1>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-start space-x-2">
                                    <div className="mt-0.5">
                                        <MapPin className="h-4 w-4 text-taxi-blue" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">Pickup Location</p>
                                        <p className="text-gray-800">{booking.pickupLocation || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <div className="mt-0.5">
                                        <MapPin className="h-4 w-4text-taxi-blue" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">Drop Location</p>
                                        <p className="text-gray-800">{booking.dropLocation || "N/A"}</p>
                                    </div>
                                </div>




                            </div>
                        </div>
                    )}

                    {isSent ? (
                        <div className="text-center py-6 space-y-5">
                            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">Details Sent Successfully!</h3>
                            <p className="text-gray-600 text-sm">The customer has been notified with the driver information.</p>

                            <div className="pt-2 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200 text-left">
                                <h4 className="font-medium text-gray-500 text-sm">Driver Information Shared</h4>
                                <div className="flex items-center gap-3 text-gray-800">
                                    <User className="h-5 w-5 text-taxi-blue" />
                                    <span>{driverName}</span>
                                </div>
                                <div className="flex items-center gap-3 text-taxi-blue">
                                    <Phone className="h-5 w-5" />
                                    <span>{driverContact}</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="mt-4 w-full border-blue-200 hover:bg-blue-50"
                                onClick={() => {
                                    setIsSent(false);
                                    setDriverName("");
                                    setDriverContact("");
                                }}
                            >
                                <RotateCw className="h-4 w-4 mr-2" />
                                Send New Details
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <h3 className="font-medium text-gray-700 flex items-center gap-2 text-sm">
                                <ArrowRight className="h-4 w-4 text-taxi-blue" />
                                Enter Driver Information
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="driverName" className="flex items-center gap-2 text-gray-700">
                                        <User className="h-4 w-4 text-taxi-blue" />
                                        Driver Full Name
                                    </Label>
                                    <Input
                                        id="driverName"
                                        type="text"
                                        placeholder="Enter a Name"
                                        value={driverName}
                                        onChange={(e) => setDriverName(e.target.value)}
                                        className="w-full focus-visible:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="driverContact" className="flex items-center gap-2 text-gray-700">
                                        <Phone className="h-4 w-4 text-taxi-blue" />
                                        Driver Phone Number
                                    </Label>
                                    <Input
                                        id="driverContact"
                                        type="tel"
                                        placeholder="+61 412 345 678"
                                        value={driverContact}
                                        onChange={(e) => setDriverContact(e.target.value)}
                                        className="w-full focus-visible:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 ml-1">Include country code (e.g., +61 for Australia)</p>
                                </div>
                            </div>

                            <Button
                                onClick={handleSend}
                                disabled={isLoading}
                                className="w-full mt-2 bg-taxi-blue hover:bg-blue-700 shadow-sm"
                                size="lg"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Send className="w-4 h-4 mr-2" />
                                        Send to Customer
                                    </span>
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}