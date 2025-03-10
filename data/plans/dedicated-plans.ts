import { Plan } from "@/types";

export const dedicatedPlans: Plan[] = [
  {
    title: "Dedicated-1",
    price: 149.99,
    popular: false,
    href: "https://billing.avlanc.com/index.php?rp=/store/dedicated-servers/dedicated-1-1",
    category: "Dedicated Servers",
    specs: {
      cpu: "Ryzen 9 7950X3D (16 Cores,32 Threads)",
      ram: "192GB DDR5 ECC RAM",
      storage: "1TB NVMe SSD",
    },
    features: [
      "1 Gbps Network",
      "Full Hardware Access",
      "DDoS Protection",
      "24/7 Priority Support",
      "IPMI Access",
      "Custom OS Installation",
    ],
  },
  {
    title: "Dedicated-2",
    price: 179.99,
    popular: false,
    href: "https://billing.avlanc.com/index.php?rp=/store/dedicated-servers/dedicated-2",
    category: "Dedicated Servers",
    specs: {
      cpu: "Ryzen 9 9950X (16 Cores,32 Threads)",
      ram: "192GB DDR5 ECC RAM",
      storage: "1TB NVMe SSD",
    },
    features: [
      "1 Gbps Network",
      "Full Hardware Access",
      "Advanced DDoS Protection",
      "24/7 Priority Support",
      "20 Gbps Network",
      "IPMI Access",
      "Custom OS Installation",
      "Hardware RAID",
    ],
  },
  {
    title: "Dedicated-3",
    price: 99.99,
    popular: true,
    href: "https://billing.avlanc.com/index.php?rp=/store/dedicated-servers/dedicated-3",
    category: "Dedicated Servers",
    specs: {
      cpu: "Intel Core I9-9900k (8 Cores,16 Threads)",
      ram: "128GB DDR4 RAM",
      storage: "1TB NVMe SSD",
    },
    features: [
      "1 Gbps Network",
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
