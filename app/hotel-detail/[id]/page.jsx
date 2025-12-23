import HotelDetails from "@/components/HotelDetails";

export default async function HotelDetailPage({ params }) {
  // 1. Await the params
  const { id } = await params;

  // 2. Defensive check
  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Hotel ID not found in URL.</p>
      </div>
    );
  }

  return (
    <div className="container py-10 mx-auto px-4">
      <HotelDetails hotelId={id} />
    </div>
  );
}