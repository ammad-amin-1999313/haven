import luxuryExterior from "../assets/hotel/hotel_1.png";
import oceanRoom from "../assets/hotel/hotel_2.png";
import cabinRoom from "../assets/hotel/hotel_3.png";
import cityRoom from "../assets/hotel/hotel_4.png";

export const hotels = [
  {
    id: "1",
    name: "The Grand Horizon Resort",
    location: "Malibu, California",
    description: "Experience unparalleled luxury at The Grand Horizon Resort. Perched on the cliffs of Malibu, this architectural masterpiece offers breathtaking panoramic views of the Pacific Ocean. Enjoy our infinity pool at sunset, world-class dining, and personalized service that caters to your every need. Perfect for romantic getaways and exclusive retreats.",
    price: 450,
    rating: 4.9,
    image: luxuryExterior,
    tags: ["Luxury", "Ocean View", "Spa"],
    amenities: ["Infinity Pool", "Private Beach Access", "Michelin Star Dining", "Spa & Wellness Center", "24/7 Concierge", "Valet Parking"]
  },
  {
    id: "2",
    name: "Azure Coastal Suites",
    location: "Santorini, Greece",
    description: "Wake up to the sound of waves in our Azure Coastal Suites. Designed with a minimalist aesthetic that highlights the natural beauty of the Aegean Sea, each suite features a private terrace and plunge pool. The bright, modern interiors provide a serene sanctuary for relaxation and rejuvenation.",
    price: 320,
    rating: 4.8,
    image: oceanRoom,
    tags: ["Beachfront", "Modern", "Romantic"],
    amenities: ["Private Plunge Pool", "Breakfast in Bed", "Sea View Terrace", "Free Wi-Fi", "Airport Shuttle", "Guided Tours"]
  },
  {
    id: "3",
    name: "Whispering Pines Lodge",
    location: "Aspen, Colorado",
    description: "Escape to the mountains at Whispering Pines Lodge. Our cozy wooden cabins offer the perfect blend of rustic charm and modern luxury. Curl up by the stone fireplace after a day of skiing, or explore the hiking trails right outside your door. A warm, inviting atmosphere awaits you in the heart of nature.",
    price: 280,
    rating: 4.7,
    image: cabinRoom,
    tags: ["Cabin", "Nature", "Cozy"],
    amenities: ["Stone Fireplace", "Hot Tub", "Ski-in/Ski-out", "Mountain Views", "Hiking Trails", "Gourmet Kitchen"]
  },
  {
    id: "4",
    name: "Metropolis Heights",
    location: "Tokyo, Japan",
    description: "Immerse yourself in the vibrant energy of Tokyo at Metropolis Heights. Located in the heart of the city, our sleek hotel offers stunning skyline views and sophisticated design. With state-of-the-art technology and luxury amenities, it's the ideal choice for modern travelers and business professionals seeking style and convenience.",
    price: 380,
    rating: 4.6,
    image: cityRoom,
    tags: ["City", "Business", "Luxury"],
    amenities: ["Rooftop Bar", "Fitness Center", "Co-working Space", "High-speed Wi-Fi", "Smart Room Controls", "Concierge Service"]
  }
];

export const hotelDetails = [
  {
    id: "1",
    name: "The Grand Horizon Resort",
    location: "Malibu, California",
    description: "Experience unparalleled luxury at The Grand Horizon Resort. Perched on the cliffs of Malibu, this architectural masterpiece offers breathtaking panoramic views of the Pacific Ocean. Enjoy our infinity pool at sunset, world-class dining, and personalized service that caters to your every need. Perfect for romantic getaways and exclusive retreats.",
    price: 450,
    rating: 4.9,
    image: luxuryExterior, 
    tags: ["Luxury", "Ocean View", "Spa"],
    amenities: ["Infinity Pool", "Private Beach Access", "Michelin Star Dining", "Spa & Wellness Center", "24/7 Concierge", "Valet Parking"]
  },
  {
    id: "2",
    name: "Azure Coastal Suites",
    location: "Santorini, Greece",
    description: "Wake up to the sound of waves in our Azure Coastal Suites. Designed with a minimalist aesthetic that highlights the natural beauty of the Aegean Sea, each suite features a private terrace and plunge pool. The bright, modern interiors provide a serene sanctuary for relaxation and rejuvenation.",
    price: 320,
    rating: 4.8,
    image: oceanRoom,
    tags: ["Beachfront", "Modern", "Romantic"],
    amenities: ["Private Plunge Pool", "Breakfast in Bed", "Sea View Terrace", "Free Wi-Fi", "Airport Shuttle", "Guided Tours"]
  },
  {
    id: "3",
    name: "Whispering Pines Lodge",
    location: "Aspen, Colorado",
    description: "Escape to the mountains at Whispering Pines Lodge. Our cozy wooden cabins offer the perfect blend of rustic charm and modern luxury. Curl up by the stone fireplace after a day of skiing, or explore the hiking trails right outside your door. A warm, inviting atmosphere awaits you in the heart of nature.",
    price: 280,
    rating: 4.7,
    image: cabinRoom,
    tags: ["Cabin", "Nature", "Cozy"],
    amenities: ["Stone Fireplace", "Hot Tub", "Ski-in/Ski-out", "Mountain Views", "Hiking Trails", "Gourmet Kitchen"]
  },
  {
    id: "4",
    name: "Metropolis Heights",
    location: "Tokyo, Japan",
    description: "Immerse yourself in the vibrant energy of Tokyo at Metropolis Heights. Located in the heart of the city, our sleek hotel offers stunning skyline views and sophisticated design. With state-of-the-art technology and luxury amenities, it's the ideal choice for modern travelers and business professionals seeking style and convenience.",
    price: 380,
    rating: 4.6,
    image: cityRoom,
    tags: ["City", "Business", "Luxury"],
    amenities: ["Rooftop Bar", "Fitness Center", "Co-working Space", "High-speed Wi-Fi", "Smart Room Controls", "Concierge Service"]
  }
]

export const mockUserBookings = [
  {
    id: "booking-1",
    hotelId: "1",
    hotelName: "The Grand Horizon Resort",
    location: "Malibu, California",
    checkIn: "2024-01-20",
    checkOut: "2024-01-25",
    price: 450,
    status: "confirmed",
    image: luxuryExterior,
  },
  {
    id: "booking-2",
    hotelId: "2",
    hotelName: "Azure Coastal Suites",
    location: "Santorini, Greece",
    checkIn: "2023-12-10",
    checkOut: "2023-12-15",
    price: 320,
    status: "completed",
    image: luxuryExterior,
  },
];

export const mockOwnerHotels = [
  {
    id: "1",
    name: "The Grand Horizon Resort",
    location: "Malibu, California",
    price: 450,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
    rooms: 45,
    bookings: 32,
  },
  {
    id: "2",
    name: "Azure Coastal Suites",
    location: "Santorini, Greece",
    price: 320,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600",
    rooms: 28,
    bookings: 24,
  },
  {
    id: "3",
    name: "Whispering Pines Lodge",
    location: "Aspen, Colorado",
    price: 280,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1618883182384-a83a8e7b9b47?q=80&w=600",
    rooms: 18,
    bookings: 15,
  },
];

// Mock owner booking requests
export const mockBookingRequests = [
  {
    id: "req-1",
    guestName: "Michael Johnson",
    hotelId: "1",
    hotelName: "The Grand Horizon Resort",
    checkIn: "2024-02-10",
    checkOut: "2024-02-15",
    guests: 2,
    status: "pending",
    price: 450,
  },
  {
    id: "req-2",
    guestName: "Emma Wilson",
    hotelId: "2",
    hotelName: "Azure Coastal Suites",
    checkIn: "2024-02-20",
    checkOut: "2024-02-25",
    guests: 4,
    status: "confirmed",
    price: 320,
  },
  {
    id: "req-3",
    guestName: "David Brown",
    hotelId: "3",
    hotelName: "Whispering Pines Lodge",
    checkIn: "2024-03-01",
    checkOut: "2024-03-05",
    guests: 3,
    status: "pending",
    price: 280,
  },
];

export const mockUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "JD",
  role: "guest",
  joinedDate: "2023-01-15",
};