
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getjourneycompleted, getpickup, getstartjourney } from "@/redux/Slice/formSlice";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/redux/hook";

export default function UpdateRide() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();


const { bookingid } = useParams();
console.log("Booking ID:", bookingid);


  const steps = [
    { id: 1, label: "Journey Started", description: "Mark when you start the journey" },
    { id: 2, label: "Pick up done", description: "Mark when passenger is picked up" },
    { id: 3, label: "Journey Completed", description: "Mark when journey is finished" }
  ];

const handleStepToggle = (stepIndex: number, checked: boolean) => {
  if (checked && stepIndex === currentStep) {
    // Dispatch the correct thunk based on the step
    if (bookingid) {
      if (stepIndex === 0) {
        dispatch(getstartjourney({ bookingId: bookingid }));
      } else if (stepIndex === 1) {
        dispatch(getpickup({ bookingId: bookingid }));
      } else if (stepIndex === 2) {
        dispatch(getjourneycompleted({ bookingId: bookingid }));
      }
    }
    // Allow progressing to next step
    setCurrentStep(stepIndex + 1);
    toast({
      title: "Status Updated",
      description: steps[stepIndex].label,
    });
  } else if (!checked && stepIndex === currentStep - 1) {
    // Allow going back one step
    setCurrentStep(stepIndex);
    toast({
      title: "Status Reverted",
      description: `Reverted to: ${stepIndex === 0 ? "Not Started" : steps[stepIndex - 1].label}`,
    });
  }
};

  const resetJourney = () => {
    setCurrentStep(0);
    toast({
      title: "Journey Reset",
      description: "All statuses have been reset",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Update Ride Status</h1>
          <p className="text-gray-600 mt-2">Track your journey progress</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isDisabled = index > currentStep;

            return (
              <div key={step.id} className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg border-2 transition-colors duration-200"
                     style={{
                       borderColor: isCompleted ? '#10b981' : isCurrent ? '#3b82f6' : '#e5e7eb',
                       backgroundColor: isCompleted ? '#f0fdf4' : isCurrent ? '#eff6ff' : '#f9fafb'
                     }}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCompleted ? 'bg-green-500 text-white' : 
                        isCurrent ? 'bg-blue-500 text-white' : 
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <Label className={`text-base font-medium ${
                          isCompleted ? 'text-green-700' : 
                          isCurrent ? 'text-blue-700' : 
                          'text-gray-500'
                        }`}>
                          {step.label}
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Switch
                    checked={isCompleted}
                    onCheckedChange={(checked) => handleStepToggle(index, checked)}
                    disabled={isDisabled}
                    className="ml-4"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Current Status: <span className="font-medium">
                {currentStep === 0 ? "Not Started" : 
                 currentStep === steps.length ? "Journey Completed" : 
                 steps[currentStep - 1].label}
              </span>
            </p>
            
            {currentStep > 0 && (
              <Button
                onClick={resetJourney}
                variant="outline"
                className="mt-4"
              >
                Reset Journey
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
