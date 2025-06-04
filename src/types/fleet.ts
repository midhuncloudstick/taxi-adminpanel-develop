

export interface Cars {
  id:string;
 car_images: string;
  model: string;
  description: string;
  features:[]| string[];
  plate: string;
  type: "sedan" | "suv" | "luxury";
  capacity: number;
  large_bags: number;
  small_bags: number;
  add_trailer: boolean;
  pricePerKm: number;
  fixedCost: number;
  status:  "available" | "in-use" | "maintenance";
  created_at:string
}
