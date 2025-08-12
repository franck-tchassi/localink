// components/Testimonial.tsx
import Image from "next/image";

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  company: string;
  avatar: string;
}

export default function Testimonial({ quote, author, position, company, avatar }: TestimonialProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <blockquote className="text-xl md:text-2xl font-medium mb-8 text-center">
        "{quote}"
      </blockquote>
      <div className="flex items-center justify-center">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white mr-4">
          <Image
            src={avatar}
            alt={author}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-bold">{author}</div>
          <div className="text-blue-100">{position}, {company}</div>
        </div>
      </div>
    </div>
  );
}