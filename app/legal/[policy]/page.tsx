import { legalContent } from "@/data/legal";
import { LegalPolicy } from "@/components/legal-policy";

export function generateStaticParams() {
  return Object.keys(legalContent).map((slug) => ({
    policy: slug,
  }));
}

type Params = Promise<{ policy: string }>;

export default async function PolicyPage({ params }: { params: Params }) {
  const legal = await params;
  const policy = legalContent[legal.policy as keyof typeof legalContent];

  return <LegalPolicy policy={policy} />;
}
