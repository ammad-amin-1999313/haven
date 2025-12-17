'use client';

import React from "react";

/**
 * ABOUT PAGE (JSX, single-file)
 * - Removed TS/alias imports like "@/components/Layout"
 * - Removed asset imports and replaced with image URLs
 * - Includes a simple Layout component inside the same file
 */

// Simple Layout (same idea as your other page)
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}


// Replace local asset imports with hosted images (you can change these anytime)
const teamImg =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop";
const lobbyImg =
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop";

export default function AboutUs() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${lobbyImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white space-y-6 animate-in fade-in zoom-in duration-700">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
            Our Story
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90 font-light tracking-wide">
            Redefining hospitality with simplicity and trust.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              A New Era of Booking
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Haven was born from a simple frustration: booking a hotel had
              become too complicated. Hidden fees, rigid cancellation policies,
              and impersonal service had taken the joy out of travel planning.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We set out to create a platform that brings trust back to the
              center of the experience. By connecting guests directly with
              property owners and enabling flexible payment options like cash on
              arrival, we&apos;re making travel accessible and stress-free again.
            </p>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <img
              src={teamImg}
              alt="Our Team"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20 border-y">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-serif font-bold text-emerald-700">
              500+
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">
              Destinations
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-4xl font-serif font-bold text-emerald-700">
              10k+
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">
              Happy Guests
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-4xl font-serif font-bold text-emerald-700">
              24/7
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">
              Support
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-4xl font-serif font-bold text-emerald-700">
              4.9
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">
              Average Rating
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-12 text-gray-900">
            Meet the Team
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Elena Rodriguez",
                role: "Founder & CEO",
                desc: "Visionary leader with 15 years in luxury hospitality.",
              },
              {
                name: "David Chen",
                role: "Head of Operations",
                desc: "Ensuring every stay meets our high standards of quality.",
              },
              {
                name: "Sarah Johnson",
                role: "Guest Experience",
                desc: "Dedicated to making your journey unforgettable.",
              },
            ].map((member, i) => (
              <div key={i} className="group">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full mb-4 overflow-hidden">
                  <div className="w-full h-full bg-emerald-700/10 flex items-center justify-center text-emerald-700 text-2xl font-serif font-bold group-hover:bg-emerald-700/20 transition-colors">
                    {member.name.charAt(0)}
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-900">
                  {member.name}
                </h3>
                <div className="text-emerald-700 text-sm font-medium mb-2">
                  {member.role}
                </div>
                <p className="text-gray-600 text-sm max-w-xs mx-auto">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
