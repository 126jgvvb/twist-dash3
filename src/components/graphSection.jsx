
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, CircleDivideIcon } from 'lucide-react';
import ClientsGraphicalData from '../chart/pieChart';
import BarX from '../chart/barGraph';

export const GraphSection = ({ routers = [], runningCodes = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  // Filter data for the current router
  const currentRouter = routers[currentIndex];
  const data = runningCodes.filter(
    (code) =>
      code.routerIP === currentRouter?.ip || code.routerIP === currentRouter?.routerIP
  );

  // Navigate manually
  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % routers.length);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + routers.length) % routers.length);

  // Auto-slide every 5s
  useEffect(() => {
    if (routers.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % routers.length);
      }, 5000);
    }

    return () => clearInterval(intervalRef.current);
  }, [routers.length]);

  // Pause on hover
  const pauseAutoSlide = () => clearInterval(intervalRef.current);
  const resumeAutoSlide = () => {
    if (routers.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % routers.length);
      }, 5000);
    }
  };

  if (!routers.length) {
    return (
      <div className="flex justify-center items-center py-20">
        <CircleDivideIcon size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div
          className="bg-card rounded-2xl shadow-md p-6 space-y-8 transition-all duration-300 hover:shadow-lg"
          onMouseEnter={pauseAutoSlide}
          onMouseLeave={resumeAutoSlide}
        >
          {/* Graphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 transition-all duration-500 ease-in-out">
            <ClientsGraphicalData tokens={data} />
            <BarX tokens={data} />
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center space-x-6 text-xl">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full hover:bg-primary/10 active:scale-95 transition"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="zoe-button px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95">
              {currentRouter?.name || 'Unnamed Router'}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full hover:bg-primary/10 active:scale-95 transition"
            >
              <ArrowRight size={24} />
            </button>
          </div>

          {/* Index Indicator */}
          <div className="flex justify-center space-x-2 mt-2">
            {routers.map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-primary scale-110'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

