
export interface Booking {
  id: string;
  date: string; // e.g., "2025-06-14T00:00:00Z"
  pickupTime: string; // e.g., "2025-06-14T15:30:00Z"
  kilometers: number;
  pickupLocation: string;
  dropLocation: string;
  amount: number;
  passengers: number;
  children: number;
  babyCapsule: number;
  babySeat: number;
  boosterseat: number;
  status: string;
  carId: string;
  car: Car;
  plate_number: string;
  car_type: string;
  driverId: number | null;
  driver: Driver;
  driver_name: string;
  driver_phone: string;
  userId: number;
  user: User;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  user_phonenumber: string;
  user_address: string;
  specialRequest: string;
  created_at: string;
  chats: Chat[] | null;
}

export interface Car {
  id: string;
  car_images: string[] | null;
  model: string;
  description: string;
  plate: string;
  type: string;
  capacity: number;
  large_bags: number;
  small_bags: number;
  add_trailer: boolean;
  pricePerKm: number;
  fixedCost: number;
  status: string;
  created_at: string;
  features: string[] | null;
}

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  licenceNumber: string;
  carId: string | null;
  car: Car | null;
  status: string;
  completedTrips: number | null;
  rating: number;
  photo: string;
  type: string;
  created_at: string;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  type: string | null;
  profile_image: string;
  address: string;
  created_at: string;
}

export interface Chat {
 
}
