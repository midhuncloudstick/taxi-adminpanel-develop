
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Baby } from 'lucide-react';

const ChildrenAndBabySeats = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Children</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">No Children</SelectItem>
            <SelectItem value="1">1 Child</SelectItem>
            <SelectItem value="2">2 Children</SelectItem>
            <SelectItem value="3">3 Children</SelectItem>
            <SelectItem value="4+">4+ Children</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Baby Seats</Label>
        <div className="relative">
          <Baby className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Select>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">None</SelectItem>
              <SelectItem value="1">1 Seat</SelectItem>
              <SelectItem value="2">2 Seats</SelectItem>
              <SelectItem value="3+">3+ Seats</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ChildrenAndBabySeats;
