// Define types
export interface Booking {
  id: string;
  date: string;
  pickupTime: string;
  status: 'requested' | 'waiting for driver confirmation' | 'driver assigned' | ' journey completed' | 'cancelled'|'pickup' |'journey started';
  kilometers: number;
  pickupLocation: string;
  dropLocation: string;
  driver: string;
  customerId: string;
  amount: number;
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  status: 'available' | 'busy' | 'off-duty';
  carId: string;
  completedTrips: number;
  photo?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalTrips: number;
  totalSpent: number;
}

export interface Car {
  id: any;
  model: string;
  plate: string;
  type: 'sedan' | 'suv' | 'luxury';
  capacity: number;
  status: 'available' | 'in-use' | 'maintenance';
  pricePerKm?: number;
  fixedCost?: number;
}

export interface PricingRule {
  id: string;
  vehicleType: 'sedan' | 'suv' | 'luxury';
  perKilometer: number;
  peakHoursSurcharge: number;
  airportFee: number;
  basePrice: number;
  rangeBasedPricing: PriceRange[];
}

export interface PriceRange {
  id: string;
  minKm: number;
  maxKm: number | null; // null represents no upper limit
  price: number; // Fixed price or per km based on type
  priceType: 'fixed' | 'per_km';
}

// Mock Bookings
export const bookings: Booking[] = [
  {
    id: 'BK-1001',
    date: '2025-04-22',
    pickupTime: '08:30',
    status: 'requested',
    kilometers: 25,
    pickupLocation: 'Brisbane Airport Terminal 1',
    dropLocation: 'Marriott Hotel, Brisbane CBD',
    driver: 'DRV-001',
    customerId: 'CUS-001',
    amount: 75.50,
    notes: 'Please meet at the designated pickup area. Customer has 2 large suitcases.'
  },
  {
    id: 'BK-1002',
    date: '2025-04-22',
    pickupTime: '10:15',
    status: 'waiting for driver confirmation',
    kilometers: 32,
    pickupLocation: 'Brisbane Airport Terminal 2',
    dropLocation: 'South Bank Parklands',
    driver: 'DRV-002',
    customerId: 'CUS-002',
    amount: 92.30,
    notes: 'Customer requested quiet ride, business meeting preparation.'
  },
  {
    id: 'BK-1003',
    date: '2025-04-21',
    pickupTime: '14:45',
    status: 'driver assigned',
    kilometers: 18,
    pickupLocation: 'Brisbane Airport Terminal 1',
    dropLocation: 'The Gabba',
    driver: 'DRV-003',
    customerId: 'CUS-003',
    amount: 58.20,
    notes: 'Sports event transportation, possible traffic delays.'
  },
  {
    id: 'BK-1004',
    date: '2025-04-21',
    pickupTime: '16:30',
    status: 'waiting for driver confirmation',
    kilometers: 45,
    pickupLocation: 'Brisbane Airport Terminal 1',
    dropLocation: 'Gold Coast',
    driver: 'DRV-001',
    customerId: 'CUS-004',
    amount: 125.75
  },
  {
    id: 'BK-1005',
    date: '2025-04-20',
    pickupTime: '09:00',
    status: 'cancelled',
    kilometers: 22,
    pickupLocation: 'Brisbane Airport Terminal 2',
    dropLocation: 'Brisbane Convention Centre',
    driver: 'DRV-004',
    customerId: 'CUS-005',
    amount: 68.50,
    notes: 'Cancelled by customer due to changed plans.'
  },
  {
    id: 'BK-1006',
    date: '2025-04-23',
    pickupTime: '11:45',
    status: 'driver assigned',
    kilometers: 28,
    pickupLocation: 'Brisbane Airport Terminal 1',
    dropLocation: 'University of Queensland',
    driver: 'DRV-002',
    customerId: 'CUS-006',
    amount: 82.20,
    notes: 'Student pickup, may have additional passengers.'
  },
  {
    id: 'BK-1007',
    date: '2025-04-23',
    pickupTime: '13:15',
    status: 'requested',
    kilometers: 15,
    pickupLocation: 'Brisbane Airport Terminal 2',
    dropLocation: 'Fortitude Valley',
    driver: 'DRV-003',
    customerId: 'CUS-007',
    amount: 52.80,
    notes: 'Early check-in at hotel requested.'
  }
];

// Mock Drivers
export const drivers: Driver[] = [
  {
    id: 'DRV-001',
    name: 'John Smith',
    phone: '+61412345678',
    email: 'john.smith@example.com',
    rating: 4.8,
    status: 'available',
    carId: 'CAR-001',
    completedTrips: 587,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 'DRV-002',
    name: 'Emma Johnson',
    phone: '+61423456789',
    email: 'emma.j@example.com',
    rating: 4.9,
    status: 'busy',
    carId: 'CAR-002',
    completedTrips: 492,
    photo: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 'DRV-003',
    name: 'Michael Chen',
    phone: '+61434567890',
    email: 'michael.c@example.com',
    rating: 4.6,
    status: 'available',
    carId: 'CAR-003',
    completedTrips: 319,
    photo: 'https://randomuser.me/api/portraits/men/57.jpg'
  },
  {
    id: 'DRV-004',
    name: 'Sarah Wilson',
    phone: '+61445678901',
    email: 'sarah.w@example.com',
    rating: 4.7,
    status: 'off-duty',
    carId: 'CAR-004',
    completedTrips: 438,
    photo: 'https://randomuser.me/api/portraits/women/29.jpg'
  }
];

// Mock Cars
export const cars: Car[] = [
  {
    id: 'CAR-001',
    model: 'Toyota Camry 2023',
    plate: 'ABC-123',
    type: 'sedan',
    capacity: 4,
    status: 'available',
    pricePerKm: 2.50,
    fixedCost: 20.00
  },
  {
    id: 'CAR-002',
    model: 'Honda CR-V 2022',
    plate: 'DEF-456',
    type: 'suv',
    capacity: 5,
    status: 'in-use',
    pricePerKm: 3.20,
    fixedCost: 25.00
  },
  {
    id: 'CAR-003',
    model: 'Mercedes-Benz E-Class 2023',
    plate: 'GHI-789',
    type: 'luxury',
    capacity: 4,
    status: 'available',
    pricePerKm: 4.50,
    fixedCost: 40.00
  },
  {
    id: 'CAR-004',
    model: 'Toyota RAV4 2022',
    plate: 'JKL-012',
    type: 'suv',
    capacity: 5,
    status: 'maintenance',
    pricePerKm: 3.00,
    fixedCost: 22.00
  },
  {
    id: 'CAR-005',
    model: 'BMW 5 Series 2023',
    plate: 'MNO-345',
    type: 'luxury',
    capacity: 4,
    status: 'available',
    pricePerKm: 4.75,
    fixedCost: 45.00
  }
];

// Mock Customers
export const customers: Customer[] = [
  {
    id: 'CUS-001',
    name: 'Alice Thompson',
    phone: '+61456789012',
    email: 'alice.t@example.com',
    address: '123 Brisbane St, Brisbane',
    totalTrips: 8,
    totalSpent: 642.50
  },
  {
    id: 'CUS-002',
    name: 'Robert Davis',
    phone: '+61467890123',
    email: 'robert.d@example.com',
    address: '45 Queen St, Brisbane',
    totalTrips: 12,
    totalSpent: 1045.75
  },
  {
    id: 'CUS-003',
    name: 'Jennifer Lee',
    phone: '+61478901234',
    email: 'jennifer.l@example.com',
    address: '78 Edward St, Brisbane',
    totalTrips: 5,
    totalSpent: 387.20
  },
  {
    id: 'CUS-004',
    name: 'David Wilson',
    phone: '+61489012345',
    email: 'david.w@example.com',
    address: '15 Adelaide St, Brisbane',
    totalTrips: 3,
    totalSpent: 248.30
  },
  {
    id: 'CUS-005',
    name: 'Lisa Brown',
    phone: '+61490123456',
    email: 'lisa.b@example.com',
    address: '92 George St, Brisbane',
    totalTrips: 7,
    totalSpent: 598.45
  }
];

// Price rules
export const pricingRules: PricingRule[] = [
  {
    id: 'PR-001',
    vehicleType: 'sedan',
    perKilometer: 2.50,
    peakHoursSurcharge: 15,
    airportFee: 10,
    basePrice: 10,
    rangeBasedPricing: [
      {
        id: 'RANGE-001',
        minKm: 0,
        maxKm: 25,
        price: 150,
        priceType: 'fixed'
      },
      {
        id: 'RANGE-002',
        minKm: 25,
        maxKm: 80,
        price: 3.40,
        priceType: 'per_km'
      },
      {
        id: 'RANGE-003',
        minKm: 80,
        maxKm: null,
        price: 2.90,
        priceType: 'per_km'
      }
    ]
  },
  {
    id: 'PR-002',
    vehicleType: 'suv',
    perKilometer: 3.20,
    peakHoursSurcharge: 18,
    airportFee: 12,
    basePrice: 12,
    rangeBasedPricing: [
      {
        id: 'RANGE-004',
        minKm: 0,
        maxKm: 25,
        price: 180,
        priceType: 'fixed'
      },
      {
        id: 'RANGE-005',
        minKm: 25,
        maxKm: 80,
        price: 4.20,
        priceType: 'per_km'
      },
      {
        id: 'RANGE-006',
        minKm: 80,
        maxKm: null,
        price: 3.70,
        priceType: 'per_km'
      }
    ]
  },
  {
    id: 'PR-003',
    vehicleType: 'luxury',
    perKilometer: 4.50,
    peakHoursSurcharge: 25,
    airportFee: 15,
    basePrice: 15,
    rangeBasedPricing: [
      {
        id: 'RANGE-007',
        minKm: 0,
        maxKm: 25,
        price: 220,
        priceType: 'fixed'
      },
      {
        id: 'RANGE-008',
        minKm: 25,
        maxKm: 80,
        price: 5.50,
        priceType: 'per_km'
      },
      {
        id: 'RANGE-009',
        minKm: 80,
        maxKm: null,
        price: 4.80,
        priceType: 'per_km'
      }
    ]
  }
];

// Helper functions
export const getDriverById = (id: string): Driver | undefined => {
  return drivers.find(driver => driver.id === id);
};

export const getCustomerById = (id: string): Customer | undefined => {
  return customers.find(customer => customer.id === id);
};

export const getCarById = (id: string): Car | undefined => {
  return cars.find(car => car.id === id);
};

export const getBookingById = (id: string): Booking | undefined => {
  return bookings.find(booking => booking.id === id);
};

export const getBookingsByDriverId = (driverId: string): Booking[] => {
  return bookings.filter(booking => booking.driver === driverId);
};

export const getBookingsByCustomerId = (customerId: string): Booking[] => {
  return bookings.filter(booking => booking.customerId === customerId);
};

export const getCompletedBookings = (): Booking[] => {
  return bookings.filter(booking => booking.status === 'journey completed');
};
