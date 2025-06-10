import { Cars } from "./fleet"

export interface Drivers {
    id: number,
    name: string,
    email: string,
    phone: string,
    licenceNumber:string,
    carId: string,
    status: "active"| "inactive",
    type:"internal"| "external",
    rating: number,
    completedTrips:number
    photo?: string,
    car:Cars

}



export interface BookingHistoryDrivers {
  id: any;
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
  car: Cars | null;
  plate_number: string;
  car_type: string;
  driverId: number;
  driver: Drivers[];
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
  chats: Chat[];
  vender_driver_id: number | null;
  vender_driver: VenderDriver;
  venderdriver_name: string;
  venderdriver_phone: string;
  cars:Cars[]
}





interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  type: string;
  profile_image: string;
  address: string;
  created_at: string;
}

interface VenderDriver {
  id: number;
  drivername: string;
  driverphone: string;
}

interface Chat {
  // Define this if chat messages are used
}
   