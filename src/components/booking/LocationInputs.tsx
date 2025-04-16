import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LucideMapPin } from 'lucide-react';
import { useScript } from '@/hooks/useScript';
import { toast } from 'sonner';
import { getGoogleMapsKey } from '@/lib/supabase/edge-functions/get-google-maps-key';
import { useClient } from '@supabase/auth-helpers-react';

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
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useClient();

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const key = await getGoogleMapsKey(supabase);
        setApiKey(key);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Google Maps API key:', error);
        toast.error('Failed to load Google Maps API key');
        setIsLoading(false);
      }
    };

    loadApiKey();
  }, [supabase]);
  
  const status = useScript(
    apiKey ? `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places` : ''
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

  return (
    <>
      {isLoading ? (
        <div className="p-4 text-center">
          <p>Loading Google Maps...</p>
        </div>
      ) : (
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
                ref={fromInputRef}
                disabled={!apiKey}
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
                disabled={!apiKey}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LocationInputs;
