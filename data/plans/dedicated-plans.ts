import { Plan } from "@/types";

export const dedicatedPlans: Plan[] = [
  {
    title: "Dedicated Server Basic",
    price: 99.99,
    category: "Dedicated Servers",
    specs: {
      ram: "32 GB",
      cpu: "8 Cores",
      storage: "2x 512 GB SSD",
      disk: "",
      backup: "",
      port: "",
      database: "",
    },
    features: [
      "Full Hardware Access",
      "DDoS Protection",
      "24/7 Priority Support",
      "10 Gbps Network",
      "IPMI Access",
      "Custom OS Installation",
    ],
  },
  {
    title: "Dedicated Server Pro",
    price: 199.99,
    category: "Dedicated Servers",
    specs: {
      ram: "64 GB",
      cpu: "16 Cores",
      storage: "2x 1 TB NVMe SSD",
      disk: "",
      backup: "",
      port: "",
      database: "",
    },
    features: [
      "Full Hardware Access",
      "Advanced DDoS Protection",
      "24/7 Priority Support",
      "20 Gbps Network",
      "IPMI Access",
      "Custom OS Installation",
      "Hardware RAID",
    ],
  },
];
