// components/IntegrationBadge.tsx
import Image from "next/image";

interface IntegrationBadgeProps {
  name: string;
  logo: string;
}

export default function IntegrationBadge({ name, logo }: IntegrationBadgeProps) {
  return (
    <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
      <div className="relative w-8 h-8 mr-3">
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <span className="font-medium text-gray-700">{name}</span>
    </div>
  );
}