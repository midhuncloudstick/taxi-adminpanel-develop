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

export interface VenderDriver {
  id: number;
  drivername: string;
  driverphone: string;
}

export interface Booking {
  id: string;
  date: string;
  pickupTime: string;
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
  driverId: number;
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
  chats: any[] | null;
  vender_driver_id: number;
  vender_driver: VenderDriver;
  venderdriver_name: string;
  venderdriver_phone: string;
}


