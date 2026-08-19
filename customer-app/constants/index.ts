// API base - change to your backend URL
export const API_BASE = 'https://servenow-backend-16sw.onrender.com/api';

export const COLORS = {
  primary: '#6C63FF',
  primaryDark: '#4B44CC',
  primaryLight: '#EEF0FF',
  secondary: '#FF6584',
  background: '#F8F9FE',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textLight: '#6B7280',
  border: '#E5E7EB',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  star: '#FBBF24',
};

export const DARK_COLORS = {
  primary: '#6C63FF',
  primaryDark: '#4B44CC',
  primaryLight: '#2A2760',
  secondary: '#FF6584',
  background: '#0F0F23',
  card: '#1A1A2E',
  text: '#F3F4F6',
  textLight: '#9CA3AF',
  border: '#374151',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  star: '#FBBF24',
};

export const CATEGORIES = [
  { id: '1', name: 'Plumber', icon: '🔧', color: '#3B82F6' },
  { id: '2', name: 'Electrician', icon: '⚡', color: '#F59E0B' },
  { id: '3', name: 'Mechanic', icon: '🔩', color: '#6B7280' },
  { id: '4', name: 'Carpenter', icon: '🪵', color: '#92400E' },
  { id: '5', name: 'AC Repair', icon: '❄️', color: '#06B6D4' },
  { id: '6', name: 'Appliance Repair', icon: '📺', color: '#8B5CF6' },
  { id: '7', name: 'Cleaner', icon: '🧹', color: '#10B981' },
  { id: '8', name: 'Painter', icon: '🎨', color: '#F97316' },
  { id: '9', name: 'Mobile Repair', icon: '📱', color: '#EC4899' },
  { id: '10', name: 'Computer Repair', icon: '💻', color: '#3B82F6' },
  { id: '11', name: 'Pest Control', icon: '🐛', color: '#84CC16' },
  { id: '12', name: 'Water Tank', icon: '💧', color: '#0EA5E9' },
  { id: '13', name: 'Home Maintenance', icon: '🏠', color: '#6C63FF' },
  { id: '14', name: 'Other', icon: '⚙️', color: '#9CA3AF' },
];

export const SAMPLE_PROVIDERS = [
  {
    id: 'p1',
    name: 'Rajesh Kumar',
    profilePicture: null,
    rating: 4.8,
    totalJobs: 312,
    experience: 8,
    basePrice: 299,
    service: 'Plumber',
    distance: '1.2 km',
    available: true,
    bio: 'Expert plumber with 8 years of experience. Specializing in leak repairs and pipe installations.',
  },
  {
    id: 'p2',
    name: 'Suresh Verma',
    profilePicture: null,
    rating: 4.6,
    totalJobs: 245,
    experience: 5,
    basePrice: 349,
    service: 'Electrician',
    distance: '0.8 km',
    available: true,
    bio: 'Certified electrician. Expert in wiring, panel upgrades, and appliance connections.',
  },
  {
    id: 'p3',
    name: 'Amit Singh',
    profilePicture: null,
    rating: 4.9,
    totalJobs: 189,
    experience: 10,
    basePrice: 499,
    service: 'AC Repair',
    distance: '2.1 km',
    available: true,
    bio: 'AC specialist with expertise in all brands. Service, repair, and installation.',
  },
];

export const SAMPLE_BOOKINGS = [
  {
    id: 'b1',
    service: 'Plumber',
    providerName: 'Rajesh Kumar',
    status: 'COMPLETED',
    date: '2026-08-15',
    price: 499,
    address: '123 MG Road, Bengaluru',
  },
  {
    id: 'b2',
    service: 'Electrician',
    providerName: 'Suresh Verma',
    status: 'ACCEPTED',
    date: '2026-08-19',
    price: 349,
    address: '456 Anna Nagar, Chennai',
  },
];
