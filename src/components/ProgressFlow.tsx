
import React from "react";
import { Check, Mail, CreditCard, Circle, Car } from "lucide-react";

const phaseIcons = [
  <Check className="text-primary" />,
  <Mail />,
  <CreditCard />,
  <Circle />,
  <Car />,
];

const defaultPhases = [
  { label: "Booking Submitted", icon: <Check className="text-primary" /> },
  { label: "Invoice Sent", icon: <Mail /> },
  { label: "Payment", icon: <CreditCard /> },
  { label: "Confirmed", icon: <Circle /> },
  { label: "Pickup", icon: <Car /> },
];

type ProgressFlowProps = {
  phases?: { label: string; icon: React.ReactNode }[];
  currentPhase: number; // index: 0-based, which phase is completed
};

const ProgressFlow: React.FC<ProgressFlowProps> = ({
  phases = defaultPhases,
  currentPhase,
}) => {
  return (
    <div className="flex flex-col items-center w-full mb-8">
      <div className="flex items-center w-full max-w-2xl">
        {phases.map((phase, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${i <= currentPhase ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md" : "bg-background text-muted-foreground border-muted"}`}
                style={{ width: 40, height: 40 }}
              >
                {React.cloneElement(phase.icon as React.ReactElement, {
                  size: 22,
                  className: i <= currentPhase ? "text-primary-foreground" : "text-muted-foreground"
                })}
              </div>
              <span
                className={`text-xs mt-2 text-center transition-all duration-200
                  ${i <= currentPhase ? "font-semibold text-primary" : "text-muted-foreground"}`}
                style={{ width: 70 }}
              >
                {phase.label}
              </span>
            </div>
            {i !== phases.length - 1 && (
              <div
                className={`flex-1 h-1 mx-1 sm:mx-2 rounded transition-all bg-gradient-to-r
                  ${i < currentPhase ? "from-primary to-primary" : "from-muted to-muted"}`}
              >
                <div
                  className={`h-full rounded`}
                  style={{
                    background:
                      i < currentPhase
                        ? "linear-gradient(to right, var(--primary), var(--primary))"
                        : "linear-gradient(to right, var(--muted), var(--muted))",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressFlow;
