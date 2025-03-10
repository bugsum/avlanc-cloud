import { Plan } from "@/types";

export const vpsPlans: Plan[] = [
  {
    title: "KVM Standard-1",
    price: 9.99,
    category: "VPS",
    location: "Germany",
    popular: true,
    href: "https://billing.avlanc.com/index.php?rp=/store/vps-budget-ger/budget",
    specs: {
      ram: "8GB",
      cpu: "2VCPU (Intel Core I7-8700k)",
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
    title: "KVM Standard-1",
    price: 9.99,
    category: "VPS",
    href: "https://billing.avlanc.com/index.php?rp=/store/vps-budget-india/budget-1",
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
    title: "KVM Premium-1",
    price: 15.99,
    category: "VPS",
    location: "Germany",
    href: "https://billing.avlanc.com/index.php?rp=/store/vps-premium-ger/premium",
    popular: false,
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
    ],
  },
];
