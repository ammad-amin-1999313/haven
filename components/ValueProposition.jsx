import React from "react";
import { features } from "../lib/features";

const ValueProposition = () => {
  return (
    <section className="py-20 container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="p-6 rounded-2xl bg-[#f8f6f3] space-y-4"
          >
            <div className="w-12 h-12 bg-[#e3e6e1] rounded-full flex items-center justify-center mx-auto text-primary text-xl font-bold font-serif">
              {feature.id}
            </div>
            <h3 className="text-xl font-bold font-serif">{feature.title}</h3>
            <p className="text-ValueProposition">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValueProposition;
