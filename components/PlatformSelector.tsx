import React, { useRef, useEffect } from 'react';
import { PlatformData } from '../types';

interface PlatformSelectorProps {
  platforms: PlatformData[];
  selectedName: string;
  onSelect: (name: string) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ platforms, selectedName, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to selected item
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const active = activeRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();

      // Calculate center position
      const scrollLeft = active.offsetLeft - (containerRect.width / 2) + (activeRect.width / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [selectedName]);

  return (
    <div 
      ref={containerRef}
      className="flex md:flex-col md:h-full md:w-full overflow-x-auto md:overflow-y-auto no-scrollbar gap-2 md:gap-1 p-2 md:p-4 snap-x"
    >
      {platforms.map((p) => {
        const isSelected = selectedName === p.name;
        return (
          <button
            key={p.name}
            ref={isSelected ? activeRef : null}
            onClick={() => onSelect(p.name)}
            className={`
              snap-start shrink-0 px-4 py-2 md:py-3 md:px-4 rounded-full md:rounded-xl text-sm font-medium transition-all duration-200
              flex items-center md:justify-between gap-2 whitespace-nowrap
              ${isSelected 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 md:border-transparent'
              }
            `}
          >
            <span>{p.name}</span>
            {isSelected && <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white"></div>}
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;