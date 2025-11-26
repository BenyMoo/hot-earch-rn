import React from 'react';
import { HotItem } from '../types';
import { ExternalLink, Flame } from 'lucide-react';

interface HotItemCardProps {
  item: HotItem;
  rank: number;
}

const HotItemCard: React.FC<HotItemCardProps> = ({ item, rank }) => {
  
  const handlePress = () => {
    // 优先使用移动端链接（如果存在且屏幕较小），否则使用标准链接
    const targetUrl = (window.innerWidth < 768 && item.mobil_url) ? item.mobil_url : item.url;
    window.open(targetUrl, '_blank');
  };

  const getRankStyle = (r: number) => {
    switch (r) {
      case 1: return "bg-red-500 text-white shadow-red-200";
      case 2: return "bg-orange-500 text-white shadow-orange-200";
      case 3: return "bg-amber-500 text-white shadow-amber-200";
      default: return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div 
      onClick={handlePress}
      className="group bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-start gap-3 relative overflow-hidden"
    >
      {/* 排名徽标 */}
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shrink-0 shadow-sm transition-colors ${getRankStyle(rank)}`}>
        {rank}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-gray-800 font-medium text-[15px] leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
          {item.title}
        </h3>
        
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
           {item.hot && (
            <div className="flex items-center gap-1 text-red-400 font-medium">
              <Flame size={12} className="fill-current" />
              <span>{item.hot}</span>
            </div>
          )}
           <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-blue-500">
              <span>阅读原文</span>
              <ExternalLink size={12} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default HotItemCard;