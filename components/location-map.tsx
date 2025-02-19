"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Wifi, Clock, Globe } from "lucide-react";

const locations = [
  { name: "New York", country: "United States", x: "23%", y: "35%" },
  { name: "London", country: "United Kingdom", x: "47%", y: "28%" },
  { name: "Frankfurt", country: "Germany", x: "50%", y: "29%" },
  { name: "Singapore", country: "Singapore", x: "74%", y: "58%" },
  { name: "Tokyo", country: "Japan", x: "82%", y: "38%" },
  { name: "Sydney", country: "Australia", x: "85%", y: "75%" },
  { name: "Delhi", country: "India", x: "65%", y: "45%" },
  { name: "Mumbai", country: "India", x: "67%", y: "50%" },
];

interface LocationInfo {
  name: string;
  country: string;
  ping: number;
  latency: number;
  ipAddress: string;
  connectionStrength: "Excellent" | "Good" | "Fair" | "Poor";
}

const LocationMap = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(
    null
  );

  const handleLocationClick = (location: { name: string; country: string }) => {
    // Simulating dynamic data fetching
    const info: LocationInfo = {
      ...location,
      ping: Math.floor(Math.random() * 100) + 1,
      latency: Math.floor(Math.random() * 200) + 1,
      ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(
        Math.random() * 256
      )}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      connectionStrength: ["Excellent", "Good", "Fair", "Poor"][
        Math.floor(Math.random() * 4)
      ] as LocationInfo["connectionStrength"],
    };
    setSelectedLocation(info);
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-24">
      <div className="relative container px-4 bg-gray-900/90 backdrop-blur-sm rounded-xl border border-blue-900/50 overflow-hidden">
        <div className="relative h-[600px] p-8">
          {/* Map Background */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: `url('/map-dark-theme.webp')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              // Make the map responsive
              width: "100%",
              height: "100%",
            }}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-gray-900/50" />

          {/* Grid Lines */}
          {/* <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          /> */}

          {/* Glowing Effects */}
          <div className="absolute inset-0">
            {locations.map((location, index) => (
              <div
                key={`glow-${index}`}
                className="absolute w-32 h-32"
                style={{
                  left: location.x,
                  top: location.y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
              </div>
            ))}
          </div>

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {locations.map((location, index) => (
              <g key={`connection-${index}`}>
                {locations.slice(index + 1).map((target, targetIndex) => (
                  <motion.path
                    key={`line-${index}-${targetIndex}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{
                      duration: 1.5,
                      delay: (index + targetIndex) * 0.2,
                    }}
                    d={`M ${location.x} ${location.y} L ${target.x} ${target.y}`}
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                    fill="none"
                  />
                ))}
              </g>
            ))}
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                <stop offset="100%" stopColor="rgba(147, 197, 253, 0.5)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Location Markers */}
          {locations.map((location, index) => (
            <motion.div
              key={`marker-${index}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: index * 0.2,
              }}
              className="absolute"
              style={{
                left: location.x,
                top: location.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="relative group cursor-pointer"
                onClick={() => handleLocationClick(location)}
              >
                {/* Marker Pulse Effect */}
                <div className="absolute -inset-4 animate-ping">
                  <div className="w-full h-full rounded-full bg-blue-500/20" />
                </div>

                {/* Marker Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur transition-all duration-200" />

                {/* Marker Icon */}
                <div className="relative flex items-center justify-center w-4 h-4">
                  <MapPin className="w-6 h-6 text-blue-400 drop-shadow-lg" />
                </div>

                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none"
                >
                  <div className="w-48 p-2 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-blue-500/30 shadow-xl">
                    <div className="text-center">
                      <p className="font-semibold text-white">
                        {location.name}
                      </p>
                      <p className="text-sm text-blue-400">
                        {location.country}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="container bg-gray-900/90 backdrop-blur-sm rounded-xl border border-blue-900/50 p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedLocation.name}, {selectedLocation.country}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white">
                  Ping: {selectedLocation.ping} ms
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white">
                  Latency: {selectedLocation.latency} ms
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-white">
                  IP: {selectedLocation.ipAddress}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-blue-400" />
                <span className="text-white">
                  Connection: {selectedLocation.connectionStrength}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationMap;
