
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LucideMapPin } from 'lucide-react';

interface LocationInputsProps {
  fromLocation: string;
  toLocation: string;
  onFromLocationChange: (value: string) => void;
  onToLocationChange: (value: string) => void;
}

const LocationInputs = ({
  fromLocation,
  toLocation,
  onFromLocationChange,
  onToLocationChange
}: LocationInputsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="from">From Location</Label>
        <div className="relative">
          <LucideMapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="from" 
            placeholder="Enter pickup location" 
            className="pl-10"
            value={fromLocation}
            onChange={(e) => onFromLocationChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="to">To Location</Label>
        <div className="relative">
          <LucideMapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="to" 
            placeholder="Enter destination" 
            className="pl-10"
            value={toLocation}
            onChange={(e) => onToLocationChange(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default LocationInputs;
