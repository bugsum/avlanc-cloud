import { legalContent } from "@/data/legal";
import { LegalPolicy } from "@/components/legal-policy";

export function generateStaticParams() {
  return Object.keys(legalContent).map((slug) => ({
    policy: slug,
  }));
}

export default function PolicyPage({ params }: { params: { policy: string } }) {
  const policy = legalContent[params.policy as keyof typeof legalContent];
  return <LegalPolicy policy={policy} />;
}
