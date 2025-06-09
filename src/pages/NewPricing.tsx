import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isEqual } from "date-fns";
import { CalendarIcon, X, Edit, Save, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getpeakdaypricing, getPricing } from "@/redux/Slice/pricingSlice";
import { useAppSelector } from "@/redux/hook";

interface PeakDayPricing {
    distance1: string;
    rate1: number;
    distance2: string;
    rate2: number;
    distance3: string;
    rate3: number;
    distance4: string;
    rate4: number;
}

export default function NewPricing() {
    const dispatch = useDispatch<AppDispatch>();
    const [peakDays, setPeakDays] = useState<Date[]>([]);
    const [peakDayPricing, setPeakDayPricing] = useState<PeakDayPricing>({
        distance1: "0-30",
        rate1: 100,
        distance2: "30-60",
        rate2: 150,
        distance3: "60-90",
        rate3: 200,
        distance4: "90+",
        rate4: 250
    });
    const [isEditingPricing, setIsEditingPricing] = useState(false);
    const [tempPricing, setTempPricing] = useState<PeakDayPricing>({ ...peakDayPricing });
    const getPrice = useAppSelector((state) => state.pricing.price)
    useEffect(() => {
        dispatch(getPricing())
    }, [])

    const handleSave = () => {
        const pricingData = {
            peakDays: peakDays.map(date => format(date, "yyyy-MM-dd")),
            peakDayPricing
        };
        console.log("Saving peak day pricing:", pricingData);
        toast.success("Pricing updated successfully");
    };

    const addPeakDay = (date: Date) => {
        const exists = peakDays.some(d => isEqual(d, date));
        if (!exists) {
            setPeakDays(prev => [...prev, date]);
        }
    };

    const removePeakDay = (dateToRemove: Date) => {
        setPeakDays(prev => prev.filter(date => !isEqual(date, dateToRemove)));
    };

    const handleRateChange = (field: keyof PeakDayPricing, value: string) => {


        setTempPricing(prev => ({
            ...prev,
            [field]: parseFloat(value) || 0
        }));
    };

    const startEditing = () => {
        setTempPricing({ ...peakDayPricing });
        setIsEditingPricing(true);
    };

    const saveEditing = () => {
        console.log("pricinggg", tempPricing)
        const peakprice = {
            rate1: tempPricing.rate1,
            rate2: tempPricing.rate2,
            rate3: tempPricing.rate3,
            rate4: tempPricing.rate4,
            peak_days: peakDays.map(date => format(date, "yyyy-MM-dd")),
        };
        console.log("peakprice", peakprice)
        dispatch(getpeakdaypricing({ ...peakprice }))
            .unwrap()
            .then(() => {
                toast.success("Pricing updated successfully");
                setPeakDayPricing({ ...tempPricing });
                setIsEditingPricing(false);
            })
            .catch(() => {
                toast.error("Failed to update pricing");
            });
    };

    const cancelEditing = () => {
        setIsEditingPricing(false);
    };

    return (
        <PageContainer title="Pricing Management">
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-taxi-blue">Price Configuration</h2>
                    <p className="text-sm text-gray-500">Manage rates and fees for your taxi service</p>
                </div>
                <div className="space-y-4">
                    {/* Edit/Save Controls (now outside the card) */}
                    <div className="flex justify-end">
                        {!isEditingPricing ? (
                            <Button
                                variant="outline"
                                onClick={startEditing}
                                className="text-taxi-teal border-taxi-teal hover:bg-taxi-teal/10 flex items-center gap-1"
                            >
                                <Edit className="h-4 w-4" />
                                Edit 
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={cancelEditing}
                                    className="text-gray-500 border-gray-300 hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={saveEditing}
                                    className="bg-taxi-teal hover:bg-taxi-teal/90 flex items-center gap-1"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Card content - removed the internal edit button section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Peak Days Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Peak Days Selection */}
                                <div className="pt-4 space-y-2 flex-1">
                                    <Label>Peak Days</Label>
                                    <div className="flex-1 border border-gray-300 p-4 rounded-lg">
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
                                </div>

                                {/* Peak Day Pricing */}
                                <div className="pt-4 space-y-2 w-full lg:w-[40%]">
                                    <Label>Peak Day Pricing</Label>
                                    <div className="border border-gray-300 p-4 rounded-lg space-y-4">
                                        {/* Distance Range 1 */}
                                        <div className="grid grid-cols-12 gap-2 items-center">
                                            <div className="col-span-5 flex items-center gap-2">
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">0-30 km</span>
                                            </div>
                                            <div className="col-span-7">
                                                <Input
                                                    type="number"
                                                    value={isEditingPricing ? tempPricing.rate1 : peakDayPricing.rate1}
                                                    onChange={(e) => handleRateChange('rate1', e.target.value)}
                                                    disabled={!isEditingPricing}
                                                    className={isEditingPricing ? "bg-white" : "bg-gray-50"}
                                                />
                                            </div>
                                        </div>

                                        {/* Distance Range 2 */}
                                        <div className="grid grid-cols-12 gap-2 items-center">
                                            <div className="col-span-5 flex items-center gap-2">
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">30-60 km</span>
                                            </div>
                                            <div className="col-span-7">
                                                <Input
                                                    type="number"
                                                    value={isEditingPricing ? tempPricing.rate2 : peakDayPricing.rate2}
                                                    onChange={(e) => handleRateChange('rate2', e.target.value)}
                                                    disabled={!isEditingPricing}
                                                    className={isEditingPricing ? "bg-white" : "bg-gray-50"}
                                                />
                                            </div>
                                        </div>

                                        {/* Distance Range 3 */}
                                        <div className="grid grid-cols-12 gap-2 items-center">
                                            <div className="col-span-5 flex items-center gap-2">
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">60-90 km</span>
                                            </div>
                                            <div className="col-span-7">
                                                <Input
                                                    type="number"
                                                    value={isEditingPricing ? tempPricing.rate3 : peakDayPricing.rate3}
                                                    onChange={(e) => handleRateChange('rate3', e.target.value)}
                                                    disabled={!isEditingPricing}
                                                    className={isEditingPricing ? "bg-white" : "bg-gray-50"}
                                                />
                                            </div>
                                        </div>

                                        {/* Distance Range 4 */}
                                        <div className="grid grid-cols-12 gap-2 items-center">
                                            <div className="col-span-5 flex items-center gap-2">
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">90+ km</span>
                                            </div>
                                            <div className="col-span-7">
                                                <Input
                                                    type="number"
                                                    value={isEditingPricing ? tempPricing.rate4 : peakDayPricing.rate4}
                                                    onChange={(e) => handleRateChange('rate4', e.target.value)}
                                                    disabled={!isEditingPricing}
                                                    className={isEditingPricing ? "bg-white" : "bg-gray-50"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>


            </div>
        </PageContainer>
    );
}