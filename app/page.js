"use client";
import HotelCard from "@/components/Card/HotelCard";
import Hero from "@/components/Hero/Hero";
import Button from "@/components/ui/Button";
import ValueProposition from "@/components/ValueProposition";
import { useHotelsQuery } from "@/features/hotel/useHotelsQuery";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: hotels, isLoading, isFetching } = useHotelsQuery({ limit: 4 });
  const handleViewAll = () => {
    router.push("/hotels");
    console.log("clicked");
  };
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Hotels Grid */}
      <section className="py-20 bg-[#f8f7f5] px-4">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Featured Destinations
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Hand-picked selection of the most exclusive and comfortable
                stays for your next journey.
              </p>
            </div>
            <Button
              onClick={handleViewAll}
              title={"View All Hotels"}
              className="hidden md:flex"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels?.hotels?.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Button
              onClick={handleViewAll}
              title={"View All Hotels"}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <div className="flex justify-center ">
        <ValueProposition />
      </div>
    </>
  );
}
