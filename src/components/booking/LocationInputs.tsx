
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LucideMapPin } from 'lucide-react';
import { useScript } from '@/hooks/useScript';
import { toast } from 'sonner';

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
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  
  const status = useScript(
    isApiKeyValid ? `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places` : ''
  );

  useEffect(() => {
    if (status === 'ready' && typeof window.google !== 'undefined') {
      if (fromInputRef.current) {
        const fromAutocomplete = new google.maps.places.Autocomplete(fromInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'au' }
        });
        
        fromAutocomplete.addListener('place_changed', () => {
          const place = fromAutocomplete.getPlace();
          if (place.formatted_address) {
            onFromLocationChange(place.formatted_address);
          }
        });
      }
      
      if (toInputRef.current) {
        const toAutocomplete = new google.maps.places.Autocomplete(toInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'au' }
        });
        
        toAutocomplete.addListener('place_changed', () => {
          const place = toAutocomplete.getPlace();
          if (place.formatted_address) {
            onToLocationChange(place.formatted_address);
          }
        });
      }
    }
  }, [status, onFromLocationChange, onToLocationChange]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      // Basic validation - you might want to add more robust key validation
      setIsApiKeyValid(true);
      toast.success('Google Maps API key added successfully');
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  return (
    <>
      {!isApiKeyValid && (
        <div className="p-4 border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 rounded-md mb-4">
          <h3 className="font-medium mb-2">Google Maps API Key Required</h3>
          <p className="text-sm mb-3">Please enter your Google Maps API key:</p>
          <form onSubmit={handleApiKeySubmit} className="flex gap-2">
            <Input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter Google Maps API Key"
              className="flex-1"
            />
            <button 
              type="submit"
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
            >
              Save
            </button>
          </form>
          <p className="text-xs mt-2 text-muted-foreground">
            Get a key at <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a> and enable the Places API.
          </p>
        </div>
      )}

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
            ref={fromInputRef}
            disabled={!isApiKeyValid}
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
            ref={toInputRef}
            disabled={!isApiKeyValid}
          />
        </div>
      </div>
    </>
  );
};

export default LocationInputs;

