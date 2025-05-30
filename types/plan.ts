export interface Plan {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  features: string[];
  href?: string;
  location?: string;
  specs?: {
    [key: string]: string;
  };
  popular?: boolean;
}
