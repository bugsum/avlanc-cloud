import { Plan } from "@/types";

export const discordPlans: Plan[] = [
  {
    title: "Standard Plan",
    price: 1.00, // Assuming this is in Indian Rupees
    category: "Discord Bots",
    specs: {
      ram: "1GB",
      cpu: "100%",
      disk: "2GB",
      backup: "3x",
      port: "1x",
      database: "2x",
    },
    features: [
      "24/7 Uptime",
      "Automatic Restarts",
      "Discord.js Supported",
      "Discrd.py Supported",
      "Basic Monitoring",
    ],
  },
  {
    title: "Premium Plan",
    price: 2.00, // Assuming this is in Indian Rupees
    category: "Discord Bots",
    popular: true,
    specs: {
      ram: "2GB",
      cpu: "150%",
      disk: "5GB",
      backup: "4x",
      port: "2x",
      database: "3x",
    },
    features: [
     "24/7 Uptime",
      "Automatic Restarts",
      "Discord.js Supported",
      "Discrd.py Supported",
      "Basic Monitoring",
    ], 
  },
  {
    title: "Ultimate Plan",
    price: 3.00, // Assuming this is in Indian Rupees
    category: "Discord Bots",
    specs: {
      ram: "3GB",
      cpu: "200%",
      disk: "10GB",
      backup: "4x",
      port: "3x",
      database: "3x",
    },
    features: [
      "24/7 Uptime",
       "Automatic Restarts",
       "Discord.js Supported",
       "Discrd.py Supported",
       "Basic Monitoring",
     ], 
  },
];
