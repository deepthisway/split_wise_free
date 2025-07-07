"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated background particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/20 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: "3s",
          }}
        />
      ))}

      {/* Floating geometric shapes */}
      <div
        className="absolute top-20 left-20 w-32 h-32 border-2 border-cyan-400/30 rounded-full animate-spin"
        style={{ animationDuration: "20s" }}
      />
      <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-pink-400/30 rotate-45 animate-pulse" />
      <div
        className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg animate-bounce"
        style={{ animationDelay: "1s" }}
      />

      {/* Main content */}
      <div className="text-center z-10 px-6">
        {/* Glowing 404 */}
        <div className="relative mb-8">
          <h1
            className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse select-none"
            style={{
              filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.5))",
            }}
          >
            404
          </h1>

          {/* Floating holographic effect */}
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-cyan-400/20 transform translate-x-2 translate-y-2 -z-10 animate-pulse">
            404
          </div>
        </div>

        {/* Error message with typing effect */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white animate-fade-in">
            Oops! Page Not Found
          </h2>
          <p
            className="text-xl text-gray-300 max-w-md mx-auto animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            Looks like you've ventured into the digital void. Don't worry, even
            the best explorers get lost sometimes!
          </p>
        </div>

        {/* Interactive return button */}
        <div className="space-y-6">
          <Link href="/">
            <button
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 active:scale-95"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="relative z-10">Return to Safety</span>

              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500" />
            </button>
          </Link>

          {/* Fun interactive elements */}
          <div className="flex justify-center space-x-4 mt-8">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" />
            <div
              className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>

        {/* Subtle hint text */}
        <div
          className="mt-12 text-gray-400 text-sm animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          Error Code: COSMIC_DRIFT | Status: TEMPORARILY_LOST_IN_SPACE
        </div>
      </div>

      {/* Mouse follower effect */}
      <div
        className="fixed pointer-events-none w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-50 z-50 transition-transform duration-100"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${isHovered ? 1.5 : 1})`,
          filter: "blur(1px)",
        }}
      />

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
