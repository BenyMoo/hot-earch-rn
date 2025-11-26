import React, { useEffect, useState, useMemo } from 'react';
import { fetchAllHotData } from './services/api';
import { ApiResponse, PlatformData } from './types';
import PlatformSelector from './components/PlatformSelector';
import HotItemCard from './components/HotItemCard';
import { SkeletonLoader } from './components/SkeletonLoader';
import { RefreshCw, Search, Github, MessageCircle, SlidersHorizontal, X, Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react';

// --- 常量与配置 ---

const LOGO_URL = "https://image-zs.oss-cn-beijing.aliyuncs.com/zs-health/image/1764143818814logo.jpg";

const DEFAULT_PRIORITY_LIST = [
  "微博",
  "今日头条",
  "百度热点",
  "腾讯新闻",
  "澎湃新闻",
  "抖音"
];

// --- 子组件 ---

// 底部信息组件
const FooterInfo = () => (
  <div className="text-xs text-slate-400 space-y-2 mt-auto pt-6 border-t border-slate-100">
      <p className="font-medium text-slate-500">易悦网络旗下产品</p>
      <p>本软件项目开源免费，禁止商用</p>
      <a 
        href="https://github.com/BenyMoo/hot-earch-rn" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-1.5 hover:text-blue-600 transition-colors w-max"
      >
          <Github size={12} />
          <span>GitHub 源码仓库</span>
      </a>
      <p>API技术支持：韩小韩</p>
      <div className="flex items-center gap-1.5">
          <MessageCircle size={12} />
          <span>联系我们关注微信公众号：易悦网络</span>
      </div>
  </div>
);

// Logo 组件
const AppLogo = () => (
  <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0 bg-slate-100">
    <img 
        src={LOGO_URL} 
        alt="易热搜 Logo" 
        className="w-full h-full object-cover"
        onError={(e) => {
            // 图片加载失败时的兜底
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-orange-400', 'flex', 'items-center', 'justify-center', 'text-white', 'font-bold', 'text-lg');
            if(e.currentTarget.parentElement) e.currentTarget.parentElement.innerText = 'Ue.';
        }}
    />
  </div>
);

// 订阅管理模态框组件
interface SubscriptionManagerProps {
    isOpen: boolean;
    onClose: () => void;
    allPlatformNames: string[];
    visibleNames: string[];
    setVisibleNames: (names: string[]) => void;
    hiddenNames: string[];
    setHiddenNames: (names: string[]) => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ 
    isOpen, onClose, visibleNames, setVisibleNames, hiddenNames, setHiddenNames 
}) => {
    if (!isOpen) return null;

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newOrder = [...visibleNames];
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        setVisibleNames(newOrder);
    };

    const handleMoveDown = (index: number) => {
        if (index === visibleNames.length - 1) return;
        const newOrder = [...visibleNames];
        [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
        setVisibleNames(newOrder);
    };

    const handleHide = (name: string) => {
        if (visibleNames.length <= 1) {
            alert("至少保留一个订阅源");
            return;
        }
        setVisibleNames(visibleNames.filter(n => n !== name));
        setHiddenNames([...hiddenNames, name]);
    };

    const handleAdd = (name: string) => {
        setHiddenNames(hiddenNames.filter(n => n !== name));
        setVisibleNames([...visibleNames, name]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-800">热搜榜单管理</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* 已订阅列表 */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                            <span>我的订阅</span>
                            <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                {visibleNames.length}
                            </span>
                        </h4>
                        <div className="space-y-2">
                            {visibleNames.map((name, index) => (
                                <div key={name} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm group hover:border-blue-200 transition-colors">
                                    <span className="font-medium text-slate-700">{name}</span>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => handleMoveUp(index)}
                                            disabled={index === 0}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="上移"
                                        >
                                            <ArrowUp size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleMoveDown(index)}
                                            disabled={index === visibleNames.length - 1}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="下移"
                                        >
                                            <ArrowDown size={16} />
                                        </button>
                                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                        <button 
                                            onClick={() => handleHide(name)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="移除"
                                        >
                                            <Minus size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <p className="text-xs text-slate-400 mt-2 text-center">可拖动排序 (暂仅支持按钮排序)</p>
                    </div>

                    {/* 未订阅/可用平台 */}
                    {hiddenNames.length > 0 && (
                        <div>
                             <h4 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                                <span>点击添加</span>
                                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {hiddenNames.length}
                                </span>
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                {hiddenNames.map(name => (
                                    <button 
                                        key={name}
                                        onClick={() => handleAdd(name)}
                                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all text-left group"
                                    >
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700 truncate">{name}</span>
                                        <Plus size={16} className="text-slate-400 group-hover:text-blue-600 shrink-0" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 主应用组件 ---

const App: React.FC = () => {
  // API 原始数据
  const [allData, setAllData] = useState<PlatformData[]>([]);
  
  // 用户偏好设置
  const [customOrder, setCustomOrder] = useState<string[]>([]);
  const [hiddenPlatforms, setHiddenPlatforms] = useState<string[]>([]);
  
  // UI 状态
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // 组件挂载时从本地存储加载配置
  useEffect(() => {
    const savedOrder = localStorage.getItem('hotSearch_order');
    const savedHidden = localStorage.getItem('hotSearch_hidden');
    
    if (savedOrder) {
        try {
            setCustomOrder(JSON.parse(savedOrder));
        } catch (e) { console.error('Failed to parse saved order'); }
    }
    if (savedHidden) {
        try {
            setHiddenPlatforms(JSON.parse(savedHidden));
        } catch (e) { console.error('Failed to parse saved hidden'); }
    }
  }, []);

  // 配置变更时保存到本地
  useEffect(() => {
     if (customOrder.length > 0) localStorage.setItem('hotSearch_order', JSON.stringify(customOrder));
  }, [customOrder]);

  useEffect(() => {
     localStorage.setItem('hotSearch_hidden', JSON.stringify(hiddenPlatforms));
  }, [hiddenPlatforms]);

  const cleanData = (rawData: PlatformData[]) => {
      return rawData
        .filter(item => {
            // 过滤：如果副标题是“要闻”，则移除微博
            if (item.name === '微博' && item.subtitle === '要闻') return false;
            return true;
        })
        .map(item => {
            // 重命名：woShiPm -> 人人都是产品经理
            if (item.name.toLowerCase() === 'woshipm') {
                return { ...item, name: '人人都是产品经理' };
            }
            return item;
        });
  };

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response: ApiResponse = await fetchAllHotData();
      if (response && Array.isArray(response.data)) {
        
        const processedData = cleanData(response.data);
        const allNames = processedData.map(p => p.name);
        
        setAllData(processedData);

        // 初始化排序/隐藏逻辑（首次加载）
        if (customOrder.length === 0 && hiddenPlatforms.length === 0) {
            // 基于优先级列表创建初始排序
            const initialOrder: string[] = [];
            const remaining: string[] = [];

            // 优先添加在数据中存在的优先级项目
            DEFAULT_PRIORITY_LIST.forEach(pName => {
                if (allNames.includes(pName)) initialOrder.push(pName);
            });

            // 添加剩余项目
            allNames.forEach(name => {
                if (!initialOrder.includes(name)) remaining.push(name);
            });
            
            const fullOrder = [...initialOrder, ...remaining];
            setCustomOrder(fullOrder);
            
            // 设置默认选中的平台
            if (!selectedPlatform) setSelectedPlatform(fullOrder[0]);
        } else {
            // 处理 API 新增平台的情况
            const knownNames = new Set([...customOrder, ...hiddenPlatforms]);
            const newNames = allNames.filter(n => !knownNames.has(n));
            
            if (newNames.length > 0) {
                // 默认将新平台追加到自定义顺序中，以便用户看到
                setCustomOrder(prev => [...prev, ...newNames]);
            }
        }
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      setError('Failed to load trending topics. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 计算最终显示的列表
  const displayPlatforms = useMemo(() => {
      if (allData.length === 0) return [];
      
      // 过滤掉隐藏的平台
      const visible = customOrder.filter(name => !hiddenPlatforms.includes(name));
      
      // 将名称映射为数据对象
      return visible
          .map(name => allData.find(p => p.name === name))
          .filter((p): p is PlatformData => p !== undefined);
  }, [allData, customOrder, hiddenPlatforms]);

  // 确保当前选中的平台有效
  useEffect(() => {
      if (!loading && displayPlatforms.length > 0) {
          // 如果当前选中的被隐藏或无效，切换到第一个可见的平台
          if (!selectedPlatform || !displayPlatforms.find(p => p.name === selectedPlatform)) {
              setSelectedPlatform(displayPlatforms[0].name);
          }
      }
  }, [displayPlatforms, loading, selectedPlatform]);


  const activePlatformData = useMemo(() => {
    return displayPlatforms.find(p => p.name === selectedPlatform);
  }, [displayPlatforms, selectedPlatform]);

  const filteredItems = useMemo(() => {
    if (!activePlatformData) return [];
    if (!searchQuery.trim()) return activePlatformData.data;
    
    return activePlatformData.data.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activePlatformData, searchQuery]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#f8fafc] overflow-hidden">
      
      {/* 订阅管理模态框 */}
      <SubscriptionManager 
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        allPlatformNames={allData.map(d => d.name)}
        visibleNames={customOrder.filter(n => !hiddenPlatforms.includes(n))}
        setVisibleNames={(newVisible) => {
             // 逻辑：将新排序的可见列表 + 现有的隐藏列表合并，作为新的自定义顺序
             setCustomOrder([...newVisible, ...hiddenPlatforms]);
        }}
        hiddenNames={hiddenPlatforms}
        setHiddenNames={setHiddenPlatforms}
      />

      {/* --- 桌面端侧边栏 --- */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <AppLogo />
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">易热搜</h1>
              <p className="text-xs text-slate-400">全网热搜聚合平台</p>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-4">
            {loading && allData.length === 0 ? (
                <div className="space-y-2">
                    {[1,2,3,4].map(i => <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse"/>)}
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-2">
                   <div className="flex items-center justify-between px-2 mb-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">订阅列表</span>
                        <button 
                            onClick={() => setIsManagerOpen(true)}
                            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-blue-600 transition-colors"
                            title="管理订阅"
                        >
                            <SlidersHorizontal size={14} />
                        </button>
                   </div>
                   <PlatformSelector 
                      platforms={displayPlatforms} 
                      selectedName={selectedPlatform} 
                      onSelect={setSelectedPlatform} 
                  />
                </div>
            )}
            
            {/* 桌面端底部信息 */}
            <FooterInfo />
        </div>
      </aside>

      {/* --- 主内容区域 --- */}
      <main className="flex-1 flex flex-col h-full relative w-full max-w-5xl mx-auto md:max-w-none bg-[#f8fafc]">
        
        {/* 顶部栏 */}
        <header className="glass-effect sticky top-0 z-10 border-b border-slate-200 md:border-none px-4 py-3 md:px-8 md:py-5 flex flex-col gap-3">
           <div className="flex items-center justify-between">
              {/* 移动端品牌标识 */}
              <div className="flex items-center gap-3 md:hidden">
                 <div className="scale-90 origin-left"><AppLogo /></div>
                 <h1 className="text-lg font-bold text-slate-900">易热搜</h1>
              </div>

              {/* 桌面端标题 */}
              <div className="hidden md:block">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-baseline gap-3">
                      {activePlatformData?.name || '加载中...'}
                      <span className="text-sm font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 hidden lg:inline-block">
                          {activePlatformData?.subtitle || '实时榜单'}
                      </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                     <span>最后更新: {activePlatformData?.update_time || '...'}</span>
                  </p>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                  <div className="md:hidden">
                    <button 
                        onClick={() => setIsManagerOpen(true)}
                        className="p-2.5 rounded-full hover:bg-white hover:shadow-sm active:scale-95 transition-all text-slate-600"
                        title="管理订阅"
                    >
                        <SlidersHorizontal size={20} />
                    </button>
                  </div>
                  <button 
                    onClick={() => loadData(true)} 
                    disabled={refreshing || loading}
                    className="p-2.5 rounded-full hover:bg-white hover:shadow-sm active:scale-95 transition-all text-slate-600"
                    title="刷新列表"
                  >
                      <RefreshCw size={20} className={`${refreshing ? 'animate-spin' : ''}`} />
                  </button>
              </div>
           </div>

           {/* 移动端平台选择器（横向滚动） */}
           <div className="md:hidden -mx-4 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
             {loading && allData.length === 0 ? (
                 <div className="flex gap-2 p-3 overflow-hidden">
                     {[1,2,3].map(i => <div key={i} className="w-24 h-8 bg-slate-100 rounded-full animate-pulse shrink-0"/>)}
                 </div>
             ) : (
                 <PlatformSelector 
                    platforms={displayPlatforms} 
                    selectedName={selectedPlatform} 
                    onSelect={setSelectedPlatform} 
                 />
             )}
           </div>

           {/* 搜索栏 */}
           <div className="relative group w-full max-w-lg mt-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder={`在 ${selectedPlatform || '列表'} 中搜索...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white/80 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm"
                />
           </div>
        </header>

        {/* 内容滚动区域 */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-8 scroll-smooth">
            {error ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="bg-red-50 p-4 rounded-full mb-4">
                        <RefreshCw className="text-red-500" size={32} />
                    </div>
                    <p className="text-slate-600 mb-4">{error}</p>
                    <button 
                        onClick={() => loadData()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        重试
                    </button>
                </div>
            ) : loading && allData.length === 0 ? (
                <SkeletonLoader />
            ) : (
                <div className="w-full max-w-4xl space-y-3 pb-20 mx-auto">
                    {filteredItems.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                             <Search size={48} className="mb-4 text-slate-200" />
                             <p>未找到相关热搜内容</p>
                         </div>
                    ) : (
                        filteredItems.map((item, idx) => (
                            <HotItemCard 
                                key={`${selectedPlatform}-${idx}`} 
                                item={item} 
                                rank={idx + 1} 
                            />
                        ))
                    )}
                    
                    {!loading && filteredItems.length > 0 && (
                        <div className="pt-8 pb-12">
                             <div className="md:hidden">
                                <FooterInfo />
                             </div>
                             <div className="hidden md:block text-center text-xs text-slate-300">
                                —— 已加载全部 {filteredItems.length} 条内容 ——
                             </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;