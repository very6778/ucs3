import React from 'react';

interface CallFeatureCardProps {
  icon: any;
  title: string;
  description: string;
  isSelected?: boolean;
  onClick: () => void;
}

const CallFeatureCard: React.FC<CallFeatureCardProps> = ({ icon: IconComponent, title, description, isSelected = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex gap-2 items-start px-2 py-4 rounded-xl min-w-[240px]  ${isSelected ? 'bg-neutral-100' : 'bg-white'} text-left transition-colors duration-200 hover:bg-neutral-50`}
    >
      <div className="flex gap-2 items-center justify-center p-2 w-10 h-10 bg-white rounded-lg border border-gray-200 border-solid">
        <IconComponent className="w-6 h-6" />
      </div>
      <div className="flex flex-col flex-1 shrink  min-w-[200px]">
        <div className="text-base text-zinc-800">{title}</div>
        <div className="mt-1 text-xs text-neutral-600 opacity-80">{description}</div>
      </div>
    </button>
  );
};

export default CallFeatureCard;