import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getjourneycompleted, getpickup, getstartjourney } from "@/redux/Slice/formSlice";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/redux/hook";
import { getBookingById } from "@/redux/Slice/bookingSlice";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function UpdateRide() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { bookingid ,driverId} = useParams();


  const booking = useAppSelector((state) => state.booking.singleBooking);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    if (booking) {
      if (booking.status === "cancelled") {
        setIsCancelled(true);
      } else if (booking.status === "journey completed") {
        setCurrentStep(3);
      } else if (booking.status === "pickup") {
        setCurrentStep(2);
      } else if (booking.status === "journey started") {
        setCurrentStep(1);
      } else {
        setCurrentStep(0);
      }
    }
  }, [booking]);

  useEffect(() => {
    if (bookingid) {
      dispatch(getBookingById({ bookingid }));
    }
  }, [dispatch, bookingid]);

  const steps = [
    { id: 1, label: "Journey Started", description: "Mark when you start the journey" },
    { id: 2, label: "Pick up done", description: "Mark when passenger is picked up" },
    { id: 3, label: "Journey Completed", description: "Mark when journey is finished" }
  ];


  const handleStepToggle = async (stepIndex: number, checked: boolean) => {
    if (!bookingid || isCancelled) return;

    // Prevent toggling if the step is already completed
    if (stepIndex < currentStep) {
      return;
    }

    if (checked && stepIndex === currentStep) {
      try {
        if (stepIndex === 0) {
        await dispatch(getstartjourney({ bookingid, driverId })).unwrap();
        } else if (stepIndex === 1) {
          await dispatch(getpickup({ bookingid: bookingid ,driverId})).unwrap();
        } else if (stepIndex === 2) {
          await dispatch(getjourneycompleted({ bookingid: bookingid ,driverId})).unwrap();
        }

        setCurrentStep(stepIndex + 1);
        toast({
          title: "Status Updated",
          description: `Ride status changed to "${steps[stepIndex].label}"`,
        });

        // Refresh booking data after status update
        dispatch(getBookingById({ bookingid }));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancelRide = async () => {
    if (!bookingid) return;

    try {
      // await dispatch(cancelBooking({ bookingId: bookingid })).unwrap();
      setIsCancelled(true);
      toast({
        title: "Ride Cancelled",
        description: "The booking has been cancelled successfully",
      });
      dispatch(getBookingById({ bookingid }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const resetJourney = () => {
    setCurrentStep(0);
    setIsCancelled(false);
    toast({
      title: "Journey Reset",
      description: "All statuses have been reset",
    });
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 text-center">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-taxi-blue p-6 text-center text-white">
          <h1 className="text-3xl font-bold font-serif">
            <span className="text-yellow-400">Brisbane</span> <span className="text-white">Premium Transfer</span>
          </h1>
          <p className="text-blue-100 mt-1">Update Ride Status</p>
        </div>

        {/* Booking Info */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-800">Booking ID:</span>
              <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded">{booking.id || "N/A"}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-blue-600">Pickup Location</Label>
                <p className="font-medium text-gray-900">{booking.pickupLocation || "N/A"}</p>
              </div>
              <div>
                <Label className="text-xs text-blue-600">Drop Location</Label>
                <p className="font-medium text-gray-900">{booking.dropLocation || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-between px-2 py-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              {isCancelled ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : currentStep === steps.length ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Clock className="h-5 w-5 text-blue-500" />
              )}
              <span className="font-medium">
                {isCancelled ? "Cancelled" :
                  currentStep === steps.length ? "Completed" :
                    currentStep === 0 ? "Not Started" : "In Progress"}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(booking.created_at).toLocaleString()}
            </span>
          </div>

          {/* Cancelled Alert */}
          {isCancelled && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ride Cancelled</AlertTitle>
              <AlertDescription>
                This booking has been cancelled and cannot be updated.
              </AlertDescription>
            </Alert>
          )}

          {/* Journey Steps */}
          <div className="space-y-4 pt-2">
            <h3 className="font-medium text-gray-700">Journey Progress</h3>

            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isDisabled = isCancelled || index > currentStep;

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border transition-all ${isCompleted
                      ? "border-green-200 bg-green-50"
                      : isCurrent
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    } ${isDisabled ? "opacity-70" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isCompleted
                          ? "bg-green-100 text-green-600"
                          : isCurrent
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <Label className={`block ${isCompleted
                            ? "text-green-800"
                            : isCurrent
                              ? "text-blue-800"
                              : "text-gray-600"
                          }`}>
                          {step.label}
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                      </div>
                    </div>

                    <Switch
                      checked={isCompleted}
                      onCheckedChange={(checked) => handleStepToggle(index, checked)}
                      disabled={isDisabled}
                      className={`${isCompleted ? "data-[state=checked]:bg-green-500" :
                          isCurrent ? "data-[state=checked]:bg-blue-500" : ""
                        }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 pt-4">
            {!isCancelled && currentStep < steps.length && (
              <Button
                onClick={handleCancelRide}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                Cancel Ride
              </Button>
            )}

            {(currentStep > 0 || isCancelled) && (
              <Button
                onClick={resetJourney}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {isCancelled ? "Re-activate Booking" : "Reset Journey"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}