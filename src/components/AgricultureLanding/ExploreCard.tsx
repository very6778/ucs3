import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ExploreCardProps {
  imageSrc: string;
  title?: string;
  description: string;
  onClick: () => void;
}

const ExploreCard: React.FC<ExploreCardProps> = ({ imageSrc, title, description, onClick }) => {
  const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

  return (
    <button
      onClick={onClick}
      className="flex relative flex-col items-start mt-4 w-full text-left transition-transform duration-200 hover:bg-neutral-50 rounded-lg"
    >
      <img
        loading="lazy"
        src={`${NEXT_PUBLIC_CDN_URL}${imageSrc}`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = imageSrc;
        }}
        alt={title}
        className="object-cover w-full rounded-3xl aspect-[1.5]"
      />
      <div className="flex z-10 flex-col mt-2 max-w-full ">
        {title ? (
          <div className="text-base font-medium text-zinc-800">{title}</div>
        ) : null}
        <div className="mt-1 text-xs text-neutral-600">{description}</div>
      </div>
      <div className="flex items-center pt-2 text-neutral-600">
        <span className="self-stretch my-auto">Supply overview</span>
        <ChevronRight className="ml-2 w-5 h-5" />
      </div>
    </button>
  );
};

export default ExploreCard;