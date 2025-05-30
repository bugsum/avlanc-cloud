"use client";
import Link from "next/link";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
// import { dedicatedPlans } from "@/data";
import { Plan } from "@/types/interfaces";
import { appDevPlans } from "@/data/plans/app-dev";
import { webDevPlans } from "@/data/plans/web-dev";
// import { useTheme } from "next-themes";

const allPlans: Plan[] = [
  // ...webPlans,
  // ...discordPlans,
  // ...minecraftPlans,
  // ...vpsPlans,
  // ...dedicatedPlans,
  ...appDevPlans,
  ...webDevPlans
];

export function ProductGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("q");
  const { addToCart } = useCart();
  const router = useRouter();
  //   const { theme } = useTheme();

  const filteredPlans = allPlans.filter(
    (plan) =>
      (!category || plan.category === category) &&
      (!searchQuery ||
        plan.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredPlans.map((plan, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{plan.title}</h3>
              {plan.popular && <Badge variant="secondary">Popular</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              {plan.category} {plan.location && `- ${plan.location}`}
            </p>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-1">
              {plan.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {feature}
                </li>
              ))}
            </ul>
            {plan.features.length > 4 && (
              <p className="text-sm text-muted-foreground mt-1">
                + {plan.features.length - 3} more features
              </p>
            )}
          </CardContent>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="flex items-center justify-start">
                <span className="text-2xl font-bold">₹{plan.price}</span>/mo
                
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {plan?.href ? (
              //   Select Plan
              // </Link>

              // <Link href={plan?.href} target="_blank" className="w-full">
                <Button
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      // Create cart item with all required fields
                      const cartItem = {
                        id: plan.id,
                        name: plan.title,
                        price: plan.price,
                        quantity: 1,
                        image: plan.image || '',
                        category: plan.category,
                        description: plan.description,
                        features: plan.features
                      };
                      
                      // Add to cart and wait for it to complete
                      await addToCart(cartItem);
                      
                      // Only redirect after successful add to cart
                      router.push('/checkout');
                    } catch (error) {
                      console.error('Error adding to cart:', error);
                      // You might want to show a toast notification here
                    }
                  }}
                  className="w-full"
                >
                  Select Plan
                </Button>
              // </Link>
            ) : (
              <Link href={"#"} className="w-full">
                <Button className="w-full" variant={"secondary"}>
                  Out Of Stock
                </Button>
              </Link>
            )}
            {/* <Button className="w-full">Select Plan</Button> */}
          </CardFooter>

        </Card>
      ))}
    </div>
  );
}
