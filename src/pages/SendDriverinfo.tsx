
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { getdriverinfo } from "@/redux/Slice/formSlice";
import { useParams } from "react-router-dom";

export default function SendDriverinfo() {
    const [driverName, setDriverName] = useState("");
    const [driverContact, setDriverContact] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropLocation, setDropLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const dispatch = useDispatch<AppDispatch>();

  const { bookingId } = useParams();

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
            bookingId: bookingId || ""
        }));

        if (getdriverinfo.fulfilled.match(resultAction)) {
            toast({
                title: "Success",
                description: "Driver information sent successfully!",
            });
            setDriverName("");
            setDriverContact("");
        } else {
            toast({
                title: "Error",
                description: "Driver information cannot sent successfully!",
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Send Driver Info</h1>
                    <p className="text-gray-600 mt-2">Enter driver details to send information</p>
                </div>

                <div className="space-y-4">



                </div>
                {/* ...rest of your code remains unchanged... */}
                <div className="space-y-2">
                    <Label htmlFor="driverName">Driver Name</Label>
                    <Input
                        id="driverName"
                        type="text"
                        placeholder="Enter driver name"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="driverContact">Driver Contact</Label>
                    <Input
                        id="driverContact"
                        type="tel"
                        placeholder="Enter contact number"
                        value={driverContact}
                        onChange={(e) => setDriverContact(e.target.value)}
                        className="w-full"
                    />
                </div>
                <Button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    <Send className="w-4 h-4 mr-2" />
                    {isLoading ? "Sending..." : "Send"}
                </Button>
            </div>
        </div>

    );
}
