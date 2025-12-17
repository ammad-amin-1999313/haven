import HotelDetails from "@/components/HotelDetails";
import { hotelDetails } from "@/lib/data";

// 1. Add 'async' to the function
export default async function HotelDetailPage({ params }) {
  
  // 2. Await the params promise
  const { id } = await params; 

  // 3. Use the resolved 'id' to find the hotel
  const hotel = hotelDetails.find((h) => String(h.id) === id) ?? hotelDetails[0];

  if (!hotel) return <div className="p-10 text-center">Hotel not found</div>;

  return (
    <div className="container py-10 mx-auto px-4">
      <HotelDetails hotelId={id} hotel={hotel} />
    </div>
  );
}