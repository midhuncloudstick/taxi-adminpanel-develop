
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { pricingRules } from "@/data/mockData";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isEqual } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const [standardRate, setStandardRate] = useState(pricingRules[0].perKilometer);
  const [suvRate, setSuvRate] = useState(pricingRules[1].perKilometer);
  const [luxuryRate, setLuxuryRate] = useState(pricingRules[2].perKilometer);
  const [peakSurcharge, setPeakSurcharge] = useState(pricingRules[0].peakHoursSurcharge);
  const [airportFee, setAirportFee] = useState(pricingRules[0].airportFee);
  const [peakDays, setPeakDays] = useState<Date[]>([]);

  const handleSave = () => {
    // In a real app, this would make an API call to update pricing
    toast.success("Pricing updated successfully");
  };

  const addPeakDay = (date: Date) => {
    // Check if the date already exists in our array
    const exists = peakDays.some(d => isEqual(d, date));
    if (!exists) {
      setPeakDays(prev => [...prev, date]);
    }
  };

  const removePeakDay = (dateToRemove: Date) => {
    setPeakDays(prev => prev.filter(date => !isEqual(date, dateToRemove)));
  };

  return (
    <PageContainer title="Pricing Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Price Configuration</h2>
          <p className="text-sm text-gray-500">Manage rates and fees for your taxi service</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kilometer Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="standard-rate">Standard Rate ($ per km)</Label>
                <Input 
                  id="standard-rate" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={standardRate} 
                  onChange={(e) => setStandardRate(parseFloat(e.target.value))} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="suv-rate">SUV Rate ($ per km)</Label>
                <Input 
                  id="suv-rate" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={suvRate} 
                  onChange={(e) => setSuvRate(parseFloat(e.target.value))} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="luxury-rate">Luxury Rate ($ per km)</Label>
                <Input 
                  id="luxury-rate" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={luxuryRate} 
                  onChange={(e) => setLuxuryRate(parseFloat(e.target.value))} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Fees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="peak-surcharge">Peak Hour Surcharge (%)</Label>
                <Input 
                  id="peak-surcharge" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={peakSurcharge} 
                  onChange={(e) => setPeakSurcharge(parseFloat(e.target.value))} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="airport-fee">Airport Fee ($)</Label>
                <Input 
                  id="airport-fee" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={airportFee} 
                  onChange={(e) => setAirportFee(parseFloat(e.target.value))} 
                />
              </div>

              <div className="pt-4 space-y-2">
                <Label>Peak Days</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Select Peak Days</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar 
                      mode="single"
                      onSelect={(date) => {
                        if (date) {
                          addPeakDay(date);
                        }
                      }}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {peakDays.length === 0 && (
                    <p className="text-sm text-gray-500">No peak days selected</p>
                  )}
                  
                  {peakDays.map((date, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {format(date, "MMM d, yyyy")}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removePeakDay(date)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-4">
                  Peak hours are defined as 7:00 AM - 9:00 AM and 4:00 PM - 7:00 PM on weekdays.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button className="bg-taxi-teal hover:bg-taxi-teal/90" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
