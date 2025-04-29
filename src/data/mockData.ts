
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
    amount: 75.50,
    notes: 'Please meet at the designated pickup area. Customer has 2 large suitcases.'
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
    amount: 92.30,
    notes: 'Customer requested quiet ride, business meeting preparation.'
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
    amount: 58.20,
    notes: 'Sports event transportation, possible traffic delays.'
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
    amount: 68.50,
    notes: 'Cancelled by customer due to changed plans.'
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
    amount: 82.20,
    notes: 'Student pickup, may have additional passengers.'
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
    amount: 52.80,
    notes: 'Early check-in at hotel requested.'
  }
];
