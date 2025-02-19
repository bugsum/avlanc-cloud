import { Plan } from "@/types";

export const vpsPlans: Plan[] = [
  {
    title: "VPS Budget",
    price: 9.99,
    category: "VPS",
    location: "Germany",
    specs: {
      ram: "8GB",
      cpu: "2VCPU (Intel Core I9-9900k)",
      storage: "64 GB SSD",
    },
    features: [
      "Full Root Access",
      "DDoS Protection",
      "24/7 Support",
      "1 Gbps Network",
    ],
  },
  {
    title: "VPS Budget",
    price: 9.99,
    category: "VPS",
    location: "India",
    specs: {
      ram: "8GB",
      cpu: "2VCPU (AMD EPYC 7452)",
      storage: "64 GB SSD",
    },
    features: [
      "Full Root Access",
      "DDoS Protection",
      "24/7 Support",
      "1 Gbps Network",
    ],
  },
  {
    title: "VPS Premium",
    price: 15.99,
    category: "VPS",
    location: "Germany",
    popular: true,
    specs: {
      ram: "8GB",
      cpu: "2VCPU (AMD Ryzen 9 7950x3D)",
      storage: "64 GB SSD",
    },
    features: [
      "Full Root Access",
      "DDoS Protection",
      "24/7 Priority Support",
      "1 Gbps Network",
      "Daily Backups",
      "Dedicated IP",
    ],
  },
];
