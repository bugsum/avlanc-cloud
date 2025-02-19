import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 text-center px-6">
      {/* Icon Section */}
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-6xl text-red-500 font-bold">404</h1>
        <h2 className="text-xl font-medium text-gray-400 mt-2">
          Oops! We couldn&apos;t find that page.
        </h2>
      </div>

      {/* Message Section */}
      <p className="max-w-md mb-8">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      {/* Action Section */}
      <div className="flex gap-4">
        <Link href="/">
          <Button
            size="lg"
            className="bg-red-500 text-white hover:bg-red-600 flex items-center"
          >
            <span>Go to Homepage →</span>
          </Button>
        </Link>
        <Link href="/support">
          <Button size="lg" variant="outline" className="border-gray-500">
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
}
