import { Plan } from "@/types";

export const webPlans: Plan[] = [
  {
    title: "Web Basic",
    price: 0.69,
    category: "Web Hosting",
    location: "Germany",
    specs: {
      ram: "1GB",
      cpu: "0.5 vCPU",
      storage: "80GB Nvme SSD",
      backup: "4x",
    },
    features: [
      "Full Root Access",
      "DDoS Protection",
      "24/7 Support",
      "1 Gbps Network",
    ],
  },
  {
    title: "Web Pro",
    price: 1.39,
    category: "Web Hosting",
    location: "Germany",
    specs: {
      ram: "2GB",
      cpu: "1 vCPU",
      storage: "160GB Nvme SSD",
      backup: "4x",
    },
    features: [
      "Full Root Access",
      "DDoS Protection",
      "24/7 Support",
      "1 Gbps Network",
    ],
  },
  {
    title: "Web Premium",
    price: 2.79,
    category: "Web Hosting",
    location: "Germany",
    specs: {
      ram: "4GB",
      cpu: "1.5 vCPU",
      storage: "320GB Nvme SSD",
      backup: "4x",
    },
    features: [
      "Full Root Access",
      "DDoS Protection",
      "24/7 Support",
      "1 Gbps Network",
    ],
  },
  {
    title: "Web Platinum",
    price: 5.59,
    category: "Web Hosting",
    location: "Germany",
    specs: {
      ram: "6GB",
      cpu: "2 vCPU",
      storage: "500GB Nvme SSD",
      backup: "4x",
    },
    features: [
      "Full Root Access",
      "DDoS Protection",
      "24/7 Support",
      "1 Gbps Network",
    ],
  },
];