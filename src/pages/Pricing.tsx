
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { pricingRules, PriceRange } from "@/data/mockData";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isEqual } from "date-fns";
import { CalendarIcon, Plus, Trash, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Categorized range types
type RangeCategory = 'local' | 'regional' | 'distance';

// Extended price range with category
interface CategorizedPriceRange extends PriceRange {
  category: RangeCategory;
}

export default function Pricing() {
  const [standardRate, setStandardRate] = useState(pricingRules[0].perKilometer);
  const [suvRate, setSuvRate] = useState(pricingRules[1].perKilometer);
  const [luxuryRate, setLuxuryRate] = useState(pricingRules[2].perKilometer);
  const [peakSurcharge, setPeakSurcharge] = useState(pricingRules[0].peakHoursSurcharge);
  const [airportFee, setAirportFee] = useState(pricingRules[0].airportFee);
  const [peakDays, setPeakDays] = useState<Date[]>([]);
  const [peakDayCharge, setPeakDayCharge] = useState<number>(25); // Default peak day charge
  
  // Convert existing ranges to categorized ranges
  const categorizeRange = (range: PriceRange): CategorizedPriceRange => {
    // Determine category based on distance range
    let category: RangeCategory = 'local';
    if (range.minKm >= 25 && range.maxKm && range.maxKm <= 80) {
      category = 'regional';
    } else if (range.minKm >= 80 || !range.maxKm) {
      category = 'distance';
    }
    return { ...range, category };
  };
  
  // Range-based pricing states with categories
  const [sedanRanges, setSedanRanges] = useState<CategorizedPriceRange[]>(
    pricingRules[0].rangeBasedPricing.map(categorizeRange)
  );
  const [suvRanges, setSuvRanges] = useState<CategorizedPriceRange[]>(
    pricingRules[1].rangeBasedPricing.map(categorizeRange)
  );
  const [luxuryRanges, setLuxuryRanges] = useState<CategorizedPriceRange[]>(
    pricingRules[2].rangeBasedPricing.map(categorizeRange)
  );
  
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

  const updateRange = (
    rangeId: string,
    field: keyof CategorizedPriceRange,
    value: any,
    vehicleType: 'sedan' | 'suv' | 'luxury'
  ) => {
    const updateRanges = (ranges: CategorizedPriceRange[]) => {
      return ranges.map(range => {
        if (range.id === rangeId) {
          return { ...range, [field]: field === 'price' || field === 'minKm' || field === 'maxKm' ? parseFloat(value) : value };
        }
        return range;
      });
    };

    if (vehicleType === 'sedan') {
      setSedanRanges(updateRanges(sedanRanges));
    } else if (vehicleType === 'suv') {
      setSuvRanges(updateRanges(suvRanges));
    } else {
      setLuxuryRanges(updateRanges(luxuryRanges));
    }
  };

  // Filter ranges by category
  const getRangesByCategory = (
    ranges: CategorizedPriceRange[],
    category: RangeCategory
  ) => {
    return ranges.filter(range => range.category === category);
  };

  return (
    <PageContainer title="Pricing Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-taxi-blue">Price Configuration</h2>
          <p className="text-sm text-gray-500">Manage rates and fees for your taxi service</p>
        </div>

        {/* Range-based pricing section */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">Range-based Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sedan" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="sedan">Sedan</TabsTrigger>
                <TabsTrigger value="suv">SUV</TabsTrigger>
                <TabsTrigger value="luxury">Luxury</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sedan" className="space-y-6">
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-md font-semibold mb-3 text-taxi-blue">Local Trips (0-25 KM)</h3>
                  <div className="space-y-4">
                    {getRangesByCategory(sedanRanges, 'local').map((range, index) => (
                      <div key={range.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-md bg-white">
                        <div>
                          <Label htmlFor={`sedan-min-${index}`}>Min KM</Label>
                          <Input
                            id={`sedan-min-${index}`}
                            type="number"
                            min="0"
                            value={range.minKm}
                            onChange={(e) => updateRange(range.id, 'minKm', e.target.value, 'sedan')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sedan-max-${index}`}>Max KM</Label>
                          <Input
                            id={`sedan-max-${index}`}
                            type="number"
                            min={range.minKm + 1}
                            value={range.maxKm || ''}
                            onChange={(e) => updateRange(range.id, 'maxKm', e.target.value === '' ? null : e.target.value, 'sedan')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sedan-price-${index}`}>
                            Fixed Price ($)
                          </Label>
                          <Input
                            id={`sedan-price-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={range.price}
                            onChange={(e) => updateRange(range.id, 'price', e.target.value, 'sedan')}
                          />
                          <Badge variant="outline" className="mt-2">Fixed Price</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-md font-semibold mb-3 text-taxi-blue">Regional Trips (25-80 KM)</h3>
                  <div className="space-y-4">
                    {getRangesByCategory(sedanRanges, 'regional').map((range, index) => (
                      <div key={range.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-md bg-white">
                        <div>
                          <Label htmlFor={`sedan-regional-min-${index}`}>Min KM</Label>
                          <Input
                            id={`sedan-regional-min-${index}`}
                            type="number"
                            min="0"
                            value={range.minKm}
                            onChange={(e) => updateRange(range.id, 'minKm', e.target.value, 'sedan')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sedan-regional-max-${index}`}>Max KM</Label>
                          <Input
                            id={`sedan-regional-max-${index}`}
                            type="number"
                            min={range.minKm + 1}
                            value={range.maxKm || ''}
                            onChange={(e) => updateRange(range.id, 'maxKm', e.target.value === '' ? null : e.target.value, 'sedan')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sedan-regional-price-${index}`}>
                            Price per KM ($)
                          </Label>
                          <Input
                            id={`sedan-regional-price-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={range.price}
                            onChange={(e) => updateRange(range.id, 'price', e.target.value, 'sedan')}
                          />
                          <Badge variant="outline" className="mt-2">Per KM Rate</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-md font-semibold mb-3 text-taxi-blue">Distance Trips (80+ KM)</h3>
                  <div className="space-y-4">
                    {getRangesByCategory(sedanRanges, 'distance').map((range, index) => (
                      <div key={range.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-md bg-white">
                        <div>
                          <Label htmlFor={`sedan-distance-min-${index}`}>Min KM</Label>
                          <Input
                            id={`sedan-distance-min-${index}`}
                            type="number"
                            min="0"
                            value={range.minKm}
                            onChange={(e) => updateRange(range.id, 'minKm', e.target.value, 'sedan')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sedan-distance-max-${index}`}>Max KM (empty for unlimited)</Label>
                          <Input
                            id={`sedan-distance-max-${index}`}
                            type="number"
                            min={range.minKm + 1}
                            value={range.maxKm || ''}
                            onChange={(e) => updateRange(range.id, 'maxKm', e.target.value === '' ? null : e.target.value, 'sedan')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sedan-distance-price-${index}`}>
                            Price per KM ($)
                          </Label>
                          <Input
                            id={`sedan-distance-price-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={range.price}
                            onChange={(e) => updateRange(range.id, 'price', e.target.value, 'sedan')}
                          />
                          <Badge variant="outline" className="mt-2">Per KM Rate</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="suv" className="space-y-6">
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-md font-semibold mb-3 text-taxi-blue">Local Trips (0-25 KM)</h3>
                  <div className="space-y-4">
                    {getRangesByCategory(suvRanges, 'local').map((range, index) => (
                      <div key={range.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-md bg-white">
                        <div>
                          <Label htmlFor={`suv-min-${index}`}>Min KM</Label>
                          <Input
                            id={`suv-min-${index}`}
                            type="number"
                            min="0"
                            value={range.minKm}
                            onChange={(e) => updateRange(range.id, 'minKm', e.target.value, 'suv')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`suv-max-${index}`}>Max KM</Label>
                          <Input
                            id={`suv-max-${index}`}
                            type="number"
                            min={range.minKm + 1}
                            value={range.maxKm || ''}
                            onChange={(e) => updateRange(range.id, 'maxKm', e.target.value === '' ? null : e.target.value, 'suv')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`suv-price-${index}`}>
                            Fixed Price ($)
                          </Label>
                          <Input
                            id={`suv-price-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={range.price}
                            onChange={(e) => updateRange(range.id, 'price', e.target.value, 'suv')}
                          />
                          <Badge variant="outline" className="mt-2">Fixed Price</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-md font-semibold mb-3 text-taxi-blue">Regional Trips (25-80 KM)</h3>
                  <div className="space-y-4">
                    {getRangesByCategory(suvRanges, 'regional').map((range, index) => (
                      <div key={range.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-md bg-white">
                        <div>
                          <Label htmlFor={`suv-regional-min-${index}`}>Min KM</Label>
                          <Input
                            id={`suv-regional-min-${index}`}
                            type="number"
                            min="0"
                            value={range.minKm}
                            onChange={(e) => updateRange(range.id, 'minKm', e.target.value, 'suv')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`suv-regional-max-${index}`}>Max KM</Label>
                          <Input
                            id={`suv-regional-max-${index}`}
                            type="number"
                            min={range.minKm + 1}
                            value={range.maxKm || ''}
                            onChange={(e) => updateRange(range.id, 'maxKm', e.target.value === '' ? null : e.target.value, 'suv')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`suv-regional-price-${index}`}>
                            Price per KM ($)
                          </Label>
                          <Input
                            id={`suv-regional-price-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={range.price}
                            onChange={(e) => updateRange(range.id, 'price', e.target.value, 'suv')}
                          />
                          <Badge variant="outline" className="mt-2">Per KM Rate</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-md font-semibold mb-3 text-taxi-blue">Distance Trips (80+ KM)</h3>
                  <div className="space-y-4">
                    {getRangesByCategory(suvRanges, 'distance').map((range, index) => (
                      <div key={range.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-md bg-white">
                        <div>
                          <Label htmlFor={`suv-distance-min-${index}`}>Min KM</Label>
                          <Input
                            id={`suv-distance-min-${index}`}
                            type="number"
                            min="0"
                            value={range.minKm}
                            onChange={(e) => updateRange(range.id, 'minKm', e.target.value, 'suv')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`suv-distance-max-${index}`}>Max KM (empty for unlimited)</Label>
                          <Input
                            id={`suv-distance-max-${index}`}
                            type="number"
                            min={range.minKm + 1}
                            value={range.maxKm || ''}
                            onChange={(e) => updateRange(range.id, 'maxKm', e.target.value === '' ? null : e.target.value, 'suv')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`suv-distance-price-${index}`}>
                            Price per KM ($)
                          </Label>
                          <Input
                            id={`suv-distance-price-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={range.price}
                            onChange={(e) => updateRange(range.id, 'price', e.target.value, 'suv')}
                          />
                          <Badge variant="outline" className="mt-2">Per KM Rate</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="luxury" className="space-y-6">
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-md font-semibold mb-3 text-taxi-blue">Local Trips (0-25 KM)</h3>
                  <div className="space-y-4">
                    {getRangesByCategory(luxuryRanges, 'local').map((range, index) => (
                      <div key={range.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-md bg-white">
                        <div>
                          <Label htmlFor={`luxury-min-${index}`}>Min KM</Label>
                          <Input
                            id={`luxury-min-${index}`}
                            type="number"
                            min="0"
                            value={range.minKm}
                            onChange={(e) => updateRange(range.id, 'minKm', e.target.value, 'luxury')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`luxury-max-${index}`}>Max KM</Label>
                          <Input
                            id={`luxury-max-${index}`}
                            type="number"
                            min={range.minKm + 1}
                            value={range.maxKm || ''}
                            onChange={(e) => updateRange(range.id, 'maxKm', e.target.value === '' ? null : e.target.value, 'luxury')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`luxury-price-${index}`}>
                            Fixed Price ($)
                          </Label>
                          <Input
                            id={`luxury-price-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={range.price}
                            onChange={(e) => updateRange(range.id, 'price', e.target.value, 'luxury')}
                          />
                          <Badge variant="outline" className="mt-2">Fixed Price</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-md font-semibold mb-3 text-taxi-blue">Regional Trips (25-80 KM)</h3>
                  <div className="space-y-4">
                    {getRangesByCategory(luxuryRanges, 'regional').map((range, index) => (
                      <div key={range.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-md bg-white">
                        <div>
                          <Label htmlFor={`luxury-regional-min-${index}`}>Min KM</Label>
                          <Input
                            id={`luxury-regional-min-${index}`}
                            type="number"
                            min="0"
                            value={range.minKm}
                            onChange={(e) => updateRange(range.id, 'minKm', e.target.value, 'luxury')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`luxury-regional-max-${index}`}>Max KM</Label>
                          <Input
                            id={`luxury-regional-max-${index}`}
                            type="number"
                            min={range.minKm + 1}
                            value={range.maxKm || ''}
                            onChange={(e) => updateRange(range.id, 'maxKm', e.target.value === '' ? null : e.target.value, 'luxury')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`luxury-regional-price-${index}`}>
                            Price per KM ($)
                          </Label>
                          <Input
                            id={`luxury-regional-price-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={range.price}
                            onChange={(e) => updateRange(range.id, 'price', e.target.value, 'luxury')}
                          />
                          <Badge variant="outline" className="mt-2">Per KM Rate</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-md font-semibold mb-3 text-taxi-blue">Distance Trips (80+ KM)</h3>
                  <div className="space-y-4">
                    {getRangesByCategory(luxuryRanges, 'distance').map((range, index) => (
                      <div key={range.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-md bg-white">
                        <div>
                          <Label htmlFor={`luxury-distance-min-${index}`}>Min KM</Label>
                          <Input
                            id={`luxury-distance-min-${index}`}
                            type="number"
                            min="0"
                            value={range.minKm}
                            onChange={(e) => updateRange(range.id, 'minKm', e.target.value, 'luxury')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`luxury-distance-max-${index}`}>Max KM (empty for unlimited)</Label>
                          <Input
                            id={`luxury-distance-max-${index}`}
                            type="number"
                            min={range.minKm + 1}
                            value={range.maxKm || ''}
                            onChange={(e) => updateRange(range.id, 'maxKm', e.target.value === '' ? null : e.target.value, 'luxury')}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`luxury-distance-price-${index}`}>
                            Price per KM ($)
                          </Label>
                          <Input
                            id={`luxury-distance-price-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={range.price}
                            onChange={(e) => updateRange(range.id, 'price', e.target.value, 'luxury')}
                          />
                          <Badge variant="outline" className="mt-2">Per KM Rate</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card> */}

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

              <div className="grid gap-2">
                <Label htmlFor="peak-day-charge">Peak Day Charge ($)</Label>
                <Input 
                  id="peak-day-charge" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={peakDayCharge} 
                  onChange={(e) => setPeakDayCharge(parseFloat(e.target.value))} 
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
                    <Badge key={index} variant="peakday" className="flex items-center gap-1">
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
                {/* <p className="text-sm text-gray-500 mb-4">
                  Peak hours are defined as 7:00 AM - 9:00 AM and 4:00 PM - 7:00 PM on weekdays.
                  Peak days will have an additional flat fee applied to all bookings.
                </p> */}
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
