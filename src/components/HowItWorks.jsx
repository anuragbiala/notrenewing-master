'use client'; 

import { useEffect, useState } from 'react';

export default function HowItWorks() {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/how-works`);
        const result = await res.json();
        if (result.success) {
          setSteps(result.data);
        } else {
          console.error('Failed to fetch steps:', result.message);
        }
      } catch (error) {
        console.error('Error fetching steps:', error);
      }
    };

    fetchSteps();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm border-[#e2e8f0]"
            >
              <div className="p-6 pt-6 text-center">
                <div className="rounded-full bg-brand-blue text-white w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="how-it-works">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[#e2e8f0] hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 hover:bg-[#f48134] hover:text-white bg-[#f9fafb] cursor-pointer">
              Learn More About How It Works
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
