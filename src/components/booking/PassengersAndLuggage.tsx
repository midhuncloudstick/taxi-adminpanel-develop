
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Briefcase } from 'lucide-react';

const PassengersAndLuggage = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Passengers</Label>
        <div className="relative">
          <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Select>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Passenger</SelectItem>
              <SelectItem value="2">2 Passengers</SelectItem>
              <SelectItem value="3">3 Passengers</SelectItem>
              <SelectItem value="4">4 Passengers</SelectItem>
              <SelectItem value="5">5 Passengers</SelectItem>
              <SelectItem value="6">6 Passengers</SelectItem>
              <SelectItem value="7+">7+ Passengers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Luggage</Label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Select>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No Luggage</SelectItem>
              <SelectItem value="1">1 Piece</SelectItem>
              <SelectItem value="2">2 Pieces</SelectItem>
              <SelectItem value="3">3 Pieces</SelectItem>
              <SelectItem value="4">4 Pieces</SelectItem>
              <SelectItem value="5+">5+ Pieces</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PassengersAndLuggage;
