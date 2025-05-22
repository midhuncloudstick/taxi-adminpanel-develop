export interface Booking {
  id: string;
  date: string; // ISO string
  pickupTime: string; // ISO string
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
  plate_number: string;
  car_type: string;
  driverId: number | null;
  driver_name: string;
  driver_phone: string;
  userId: number;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  user_phonenumber: string;
  user_address: string;
  specialRequest: string;
  created_at: string;

  car: {
    id: string;
    car_images: string | null;
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
  };

  driver: {
    id: number;
    name: string;
    email: string;
    phone: string;
    licenceNumber: string;
    carId: string | null;
    car: any; // replace with a proper Car type if needed
    status: string;
    completedTrips: number | null;
    rating: number;
    photo: string;
    type: string;
    created_at: string;
  };

  user: {
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
  };
}
