"use client";

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { discordPlans } from "@/data";
import { minecraftPlans } from "@/data";
import { vpsPlans } from "@/data";
// import { dedicatedPlans } from "@/data";
import { Plan } from "@/types";
import { webPlans } from "@/data/plans/web-plans";
// import { useTheme } from "next-themes";

const allPlans: Plan[] = [
  ...discordPlans,
  ...minecraftPlans,
  ...vpsPlans,
  ...webPlans,
];

export function ProductGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("q");
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
            <CardTitle className="flex justify-between items-center">
              {plan.title}
              {plan.popular && <Badge variant="secondary">Popular</Badge>}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {plan.category} {plan.location && `- ${plan.location}`}
            </p>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-2xl font-bold mb-4">
              ${plan.price.toFixed(2)}
              <span className="text-lg font-normal text-muted-foreground">
                /mo
              </span>
            </p>
            <ul className="space-y-2 mb-4">
              {Object.entries(plan.specs).map(([key, value]) => (
                <li key={key} className="flex items-center text-sm">
                  <span className="w-20 font-medium">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>{" "}
                  {value}
                </li>
              ))}
            </ul>
            <ul className="space-y-1">
              {plan.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {feature}
                </li>
              ))}
            </ul>
            {plan.features.length > 3 && (
              <p className="text-sm text-muted-foreground mt-1">
                + {plan.features.length - 3} more features
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full">Select Plan</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
