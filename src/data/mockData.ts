export interface Booking {
  id: string;
  date: string;
  pickupTime: string;
  status: 'pending' | 'upcoming' | 'completed' | 'cancelled';
  kilometers: number;
  pickupLocation: string;
  dropLocation: string;
  driver: string;
  customerId: string;
  amount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings: string[]; // booking ids
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  license: string;
  status: 'active' | 'inactive';
  carId: string;
}

export interface Car {
  id: string;
  model: string;
  plate: string;
  type: 'sedan' | 'suv' | 'luxury';
  capacity: number;
  status: 'available' | 'in-use' | 'maintenance';
}

export interface PricingRule {
  id: string;
  name: string;
  baseRate: number;
  perKilometer: number;
  peakHoursSurcharge: number;
  airportFee: number;
}

// Mock Bookings
export const bookings: Booking[] = [
  {
    id: 'BK-1001',
    date: '2025-04-22',
    pickupTime: '08:30',
    status: 'pending',
    kilometers: 25,
    pickupLocation: 'Brisbane Airport Terminal 1',
    dropLocation: 'Marriott Hotel, Brisbane CBD',
    driver: 'DRV-001',
    customerId: 'CUS-001',
    amount: 75.50
  },
  {
    id: 'BK-1002',
    date: '2025-04-22',
    pickupTime: '10:15',
    status: 'upcoming',
    kilometers: 32,
    pickupLocation: 'Brisbane Airport Terminal 2',
    dropLocation: 'South Bank Parklands',
    driver: 'DRV-002',
    customerId: 'CUS-002',
    amount: 92.30
  },
  {
    id: 'BK-1003',
    date: '2025-04-21',
    pickupTime: '14:45',
    status: 'completed',
    kilometers: 18,
    pickupLocation: 'Brisbane Airport Terminal 1',
    dropLocation: 'The Gabba',
    driver: 'DRV-003',
    customerId: 'CUS-003',
    amount: 58.20
  },
  {
    id: 'BK-1004',
    date: '2025-04-21',
    pickupTime: '16:30',
    status: 'completed',
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
    amount: 68.50
  },
  {
    id: 'BK-1006',
    date: '2025-04-23',
    pickupTime: '11:45',
    status: 'pending',
    kilometers: 28,
    pickupLocation: 'Brisbane Airport Terminal 1',
    dropLocation: 'University of Queensland',
    driver: 'DRV-002',
    customerId: 'CUS-006',
    amount: 82.20
  },
  {
    id: 'BK-1007',
    date: '2025-04-23',
    pickupTime: '13:15',
    status: 'upcoming',
    kilometers: 15,
    pickupLocation: 'Brisbane Airport Terminal 2',
    dropLocation: 'Fortitude Valley',
    driver: 'DRV-003',
    customerId: 'CUS-007',
    amount: 52.80
  }
];

// Mock Customers
export const customers: Customer[] = [
  {
    id: 'CUS-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '0412 345 678',
    bookings: ['BK-1001']
  },
  {
    id: 'CUS-002',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    phone: '0423 456 789',
    bookings: ['BK-1002']
  },
  {
    id: 'CUS-003',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '0434 567 890',
    bookings: ['BK-1003']
  },
  {
    id: 'CUS-004',
    name: 'Sophia Davis',
    email: 'sophia.davis@example.com',
    phone: '0445 678 901',
    bookings: ['BK-1004']
  },
  {
    id: 'CUS-005',
    name: 'Oliver Taylor',
    email: 'oliver.taylor@example.com',
    phone: '0456 789 012',
    bookings: ['BK-1005']
  },
  {
    id: 'CUS-006',
    name: 'Isabella Martinez',
    email: 'isabella.martinez@example.com',
    phone: '0467 890 123',
    bookings: ['BK-1006']
  },
  {
    id: 'CUS-007',
    name: 'William Johnson',
    email: 'william.johnson@example.com',
    phone: '0478 901 234',
    bookings: ['BK-1007']
  }
];

// Mock Drivers
export const drivers: Driver[] = [
  {
    id: 'DRV-001',
    name: 'David Chen',
    phone: '0412 123 456',
    email: 'david.chen@example.com',
    license: 'DL-98765',
    status: 'active',
    carId: 'CAR-001'
  },
  {
    id: 'DRV-002',
    name: 'Sarah Williams',
    phone: '0423 234 567',
    email: 'sarah.williams@example.com',
    license: 'DL-87654',
    status: 'active',
    carId: 'CAR-002'
  },
  {
    id: 'DRV-003',
    name: 'James Thompson',
    phone: '0434 345 678',
    email: 'james.thompson@example.com',
    license: 'DL-76543',
    status: 'active',
    carId: 'CAR-003'
  },
  {
    id: 'DRV-004',
    name: 'Alexandra Rodriguez',
    phone: '0445 456 789',
    email: 'alexandra.rodriguez@example.com',
    license: 'DL-65432',
    status: 'inactive',
    carId: 'CAR-004'
  },
  {
    id: 'DRV-005',
    name: 'Thomas Lee',
    phone: '0456 567 890',
    email: 'thomas.lee@example.com',
    license: 'DL-54321',
    status: 'active',
    carId: 'CAR-005'
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
    status: 'available'
  },
  {
    id: 'CAR-002',
    model: 'Honda CR-V 2022',
    plate: 'DEF-456',
    type: 'suv',
    capacity: 5,
    status: 'in-use'
  },
  {
    id: 'CAR-003',
    model: 'Mercedes E-Class 2023',
    plate: 'GHI-789',
    type: 'luxury',
    capacity: 4,
    status: 'available'
  },
  {
    id: 'CAR-004',
    model: 'Ford Explorer 2022',
    plate: 'JKL-012',
    type: 'suv',
    capacity: 7,
    status: 'maintenance'
  },
  {
    id: 'CAR-005',
    model: 'BMW 5 Series 2023',
    plate: 'MNO-345',
    type: 'luxury',
    capacity: 4,
    status: 'available'
  }
];

// Mock Pricing Rules
export const pricingRules: PricingRule[] = [
  {
    id: 'PR-001',
    name: 'Standard Rate',
    baseRate: 10.00,
    perKilometer: 2.50,
    peakHoursSurcharge: 1.25,
    airportFee: 5.00
  },
  {
    id: 'PR-002',
    name: 'SUV Rate',
    baseRate: 15.00,
    perKilometer: 3.00,
    peakHoursSurcharge: 1.50,
    airportFee: 5.00
  },
  {
    id: 'PR-003',
    name: 'Luxury Rate',
    baseRate: 20.00,
    perKilometer: 3.50,
    peakHoursSurcharge: 2.00,
    airportFee: 5.00
  }
];

// Helper function to get driver by ID
export const getDriverById = (id: string): Driver | undefined => {
  return drivers.find(driver => driver.id === id);
};

// Helper function to get car by ID
export const getCarById = (id: string): Car | undefined => {
  return cars.find(car => car.id === id);
};

// Helper function to get customer by ID
export const getCustomerById = (id: string): Customer | undefined => {
  return customers.find(customer => customer.id === id);
};

// Helper function to get upcoming bookings
export const getUpcomingBookings = (): Booking[] => {
  return bookings.filter(booking => booking.status === 'upcoming');
};

// Helper function to get completed bookings
export const getCompletedBookings = (): Booking[] => {
  return bookings.filter(booking => booking.status === 'completed');
};

// Helper function to get cancelled bookings
export const getCancelledBookings = (): Booking[] => {
  return bookings.filter(booking => booking.status === 'cancelled');
};

// Helper function to get bookings by customer ID
export const getBookingsByCustomerId = (customerId: string): Booking[] => {
  return bookings.filter(booking => booking.customerId === customerId);
};

// Helper function to get bookings by driver ID
export const getBookingsByDriverId = (driverId: string): Booking[] => {
  return bookings.filter(booking => booking.driver === driverId);
};

// Helper function to get pending bookings
export const getPendingBookings = (): Booking[] => {
  return bookings.filter(booking => booking.status === 'pending');
};
