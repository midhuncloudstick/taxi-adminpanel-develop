
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressFlow from "@/components/ProgressFlow";
import { Button } from "@/components/ui/button";

// Mock booking ID (in a real app, this would come from backend or route param)
const bookingId = "BKG-20240421-1234";

const phases = [
  { label: "Booking Submitted", icon: <span className="font-bold">1</span> },
  { label: "Invoice Sent", icon: <span className="font-bold">2</span> },
  { label: "Payment", icon: <span className="font-bold">3</span> },
  { label: "Confirmed", icon: <span className="font-bold">4</span> },
  { label: "Pickup", icon: <span className="font-bold">5</span> },
];

const BookingConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container-custom py-16">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">Thank You For Your Booking!</h1>
          {/* Display booking ID */}
          <div className="mb-4 text-base font-semibold text-muted-foreground">
            Booking ID: <span className="bg-muted px-2 py-0.5 rounded">{bookingId}</span>
          </div>
          <ProgressFlow currentPhase={0} />
          <div className="bg-muted px-6 py-8 rounded-lg shadow my-8">
            <p className="text-lg mb-2">
              We have <strong>received your booking</strong>.
            </p>
            <p className="text-base text-muted-foreground mb-3">
              One of our agents will get in touch with you via <span className="font-medium text-primary">email</span> and <span className="font-medium text-primary">SMS</span> shortly with your invoice.
            </p>
            <ul className="list-disc text-left text-sm px-4 mt-4 space-y-1 text-muted-foreground">
              <li>You’ll receive an invoice and next steps for payment soon.</li>
              <li>After payment, your booking will be confirmed.</li>
              <li>On pickup day, 100% progress achieved!</li>
              {/* New bullet point for tracking email */}
              <li>
                You may receive an email with the booking link to track the status.
              </li>
            </ul>
          </div>
          <Button onClick={() => navigate("/")} className="w-full max-w-xs mt-4">
            Back to Home
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;

