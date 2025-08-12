// components/FeatureDetail.tsx
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function FeatureDetail({
  title,
  subtitle,
  features,

  image,
  cta,
  children,
}: {
  title: string;
  subtitle: string;
  features: { title: string; description: string }[];
  image?: string;
  
  cta?: { text: string; href: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-xl text-gray-600">{subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    {index + 1}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {cta && (
            <div className="mt-8">
              <Button asChild>
                <Link href={cta.href}>{cta.text}</Link>
              </Button>
            </div>
          )}
        </div>

        {image && (
          <div className="relative aspect-video rounded-lg shadow-lg overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      <div className="mt-16">{children}</div>
    </div>
  );
}