
import React, { useState, useEffect, useRef } from 'react';
import { 
  PieChart as PieIcon, Sliders, User, Search, Filter, AlertTriangle, 
  CheckCircle, ArrowRight, Info, ChevronDown, Download, Sparkles, 
  Calendar, Phone, Video, MapPin, X, Bot, Plus, ArrowUpRight, Shield,
  Check, TrendingUp, DollarSign
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Button, Card, Badge } from '../components/UIComponents';
import { InvestmentFund, PortfolioStrategy, Advisor, ChatMessage, UserState } from '../types';

// --- MOCK DATA ---
const PORTFOLIOS: PortfolioStrategy[] = [
  {
    id: 'port_cons', name: 'Conservative Income', riskLabel: 'Conservative',
    description: 'Prioritizes capital preservation with steady income.',
    fitScore: 65, expectedReturnRange: '4-6%',
    allocations: [{ fundId: 'f2', percentage: 60 }, { fundId: 'f1', percentage: 20 }, { fundId: 'f4', percentage: 20 }]
  },
  {
    id: 'port_bal', name: 'Balanced Growth', riskLabel: 'Balanced',
    description: 'A healthy mix of growth potential and stability.',
    fitScore: 94, expectedReturnRange: '6-8%',
    allocations: [{ fundId: 'f1', percentage: 40 }, { fundId: 'f2', percentage: 30 }, { fundId: 'f3', percentage: 20 }, { fundId: 'f4', percentage: 10 }]
  },
  {
    id: 'port_growth', name: 'Aggressive Growth', riskLabel: 'Growth',
    description: 'Maximizes long-term growth with higher volatility.',
    fitScore: 78, expectedReturnRange: '8-10%',
    allocations: [{ fundId: 'f1', percentage: 60 }, { fundId: 'f3', percentage: 30 }, { fundId: 'f2', percentage: 10 }]
  }
];

const ADVISORS: Advisor[] = [
  {
    id: 'adv1', name: 'Sarah Jenkins', photoUrl: 'https://i.pravatar.cc/150?u=adv1',
    credentials: ['CFP®', 'CFA'], specialties: ['Retirement Planning', 'Tax Strategy'],
    rating: 4.9, isOnline: true, nextAvailableSlot: 'Today, 2:00 PM', type: 'HUMAN'
  },
  {
    id: 'adv2', name: 'Michael Ross', photoUrl: 'https://i.pravatar.cc/150?u=adv2',
    credentials: ['CFP®'], specialties: ['Debt Management', '401(k) Allocation'],
    rating: 4.8, isOnline: false, nextAvailableSlot: 'Tomorrow, 10:00 AM', type: 'HUMAN'
  }
];

const SOURCES_COMPATIBILITY = [
    { id: 's1', name: '401(k) Plan', compatible: true },
    { id: 's2', name: 'Roth IRA', compatible: true },
    { id: 's3', name: 'HSA', compatible: false, issue: 'VTI not available' }
];

const COLORS = ['#0B5FFF', '#00B37E', '#8B5CF6', '#F59E0B', '#EC4899', '#6366F1'];

interface Props {
  userState: UserState;
  onUpdateInvestments: (funds: InvestmentFund[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface FundRowProps {
  fund: InvestmentFund;
  onAllocationChange: (id: string, value: number) => void;
}

const FundRow: React.FC<FundRowProps> = ({ fund, onAllocationChange }) => (
  <div className={`group p-5 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300 ${fund.allocation > 0 ? 'bg-blue-50/30 border-blue-200 shadow-sm' : ''}`}>
     <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Fund Info */}
        <div className="flex-1 w-full">
           <div className="flex items-center gap-3 mb-2">
              <h4 className="font-bold text-gray-900 text-lg">{fund.name}</h4>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">{fund.ticker}</span>
              {fund.allocation > 0 && (
                 <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Sparkles size={10}/> AI Insight
                 </span>
              )}
           </div>
           <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Shield size={12}/> {fund.assetClass}</span>
              <span className="flex items-center gap-1"><DollarSign size={12}/> Exp: {fund.expenseRatio}%</span>
              <span>Risk: {fund.riskLevel}/10</span>
           </div>
        </div>

        {/* Sparkline */}
        <div className="hidden md:flex items-end gap-1 h-10 w-32 opacity-60">
           {fund.returns.map((r, i) => (
              <div 
                key={i} 
                style={{ height: `${r * 3}px` }} 
                className={`w-1.5 rounded-t-sm transition-all ${r > 10 ? 'bg-accent' : 'bg-primary'}`} 
              />
           ))}
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
           <input 
              type="range" min="0" max="100" step="1"
              value={fund.allocation}
              onChange={(e) => onAllocationChange(fund.id, Number(e.target.value))}
              className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-blue-600"
              aria-label={`Allocation slider for ${fund.name}`}
           />
           <div className="relative group/input">
              <input 
                type="number" 
                value={fund.allocation} 
                onChange={(e) => onAllocationChange(fund.id, Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-20 pl-3 pr-6 py-2 text-right font-bold text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all group-hover/input:border-blue-300"
              />
              <span className="absolute right-3 top-2 text-gray-400 pointer-events-none font-medium">%</span>
           </div>
        </div>
     </div>
  </div>
);

export const InvestmentElections: React.FC<Props> = ({ userState, onUpdateInvestments, onNext, onBack }) => {
  const [activeTab, setActiveTab] = useState<'AI' | 'MANUAL' | 'ADVISOR'>('AI');
  const [localFunds, setLocalFunds] = useState<InvestmentFund[]>(userState.investments);
  const [totalAllocation, setTotalAllocation] = useState(0);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [advisorMode, setAdvisorMode] = useState<'CHAT' | 'BOOK'>('CHAT');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi Satish — I can recommend a portfolio or manage funds with you. What would you like to do?', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [applyToAllSources, setApplyToAllSources] = useState(false);

  useEffect(() => {
    const total = localFunds.reduce((sum, f) => sum + f.allocation, 0);
    setTotalAllocation(total);
  }, [localFunds]);

  // --- ACTIONS ---

  const handleAllocationChange = (id: string, value: number) => {
    setLocalFunds(prev => prev.map(f => f.id === id ? { ...f, allocation: value } : f));
    setSelectedPortfolioId(null); // Clear portfolio selection if manually edited
  };

  const applyPortfolio = (portfolio: PortfolioStrategy) => {
    const newFunds = localFunds.map(f => ({ ...f, allocation: 0 }));
    portfolio.allocations.forEach(a => {
      const fundIndex = newFunds.findIndex(f => f.id === a.fundId);
      if (fundIndex !== -1) newFunds[fundIndex].allocation = a.percentage;
    });
    setLocalFunds(newFunds);
    setSelectedPortfolioId(portfolio.id);
  };

  const normalizeAllocation = () => {
    const activeFunds = localFunds.filter(f => f.allocation > 0);
    if (activeFunds.length === 0) return;
    const currentSum = activeFunds.reduce((a, b) => a + b.allocation, 0);
    const factor = 100 / currentSum;
    
    setLocalFunds(prev => prev.map(f => ({
      ...f,
      allocation: f.allocation > 0 ? Math.round(f.allocation * factor) : 0
    })));
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    
    // Mock AI Response
    setTimeout(() => {
      let responseText = "I can help with that. Would you like me to analyze your current risk profile?";
      const lower = chatInput.toLowerCase();
      if (lower.includes('moderate') || lower.includes('balanced')) {
         responseText = "I've generated a Balanced Growth portfolio for you based on your request.";
         applyPortfolio(PORTFOLIOS[1]);
      } else if (lower.includes('aggressive') || lower.includes('growth')) {
         responseText = "Switching to an Aggressive strategy focused on equity.";
         applyPortfolio(PORTFOLIOS[2]);
      }
      
      setChatMessages(prev => [...prev, { 
        role: 'model', 
        text: responseText, 
        timestamp: new Date(),
        actions: lower.includes('moderate') ? [{ label: 'View Details', action: 'view_details' }] : undefined
      }]);
    }, 1000);
  };

  // --- SIDEBAR COMPONENT ---
  const Sidebar = () => {
    const chartData = localFunds.filter(f => f.allocation > 0).map(f => ({ name: f.ticker, value: f.allocation }));
    
    return (
      <div className="space-y-6 sticky top-24">
        {/* Your Allocation Summary */}
        <div className="bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
             <h3 className="font-display font-bold text-gray-900 text-lg">Allocation Summary</h3>
             <p className="text-xs text-gray-500 mt-1">Real-time impact of your elections.</p>
          </div>
          
          <div className="p-6 flex flex-col items-center">
             <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={chartData} 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={4} 
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className={`text-4xl font-display font-bold ${totalAllocation === 100 ? 'text-primary' : 'text-orange-500'}`}>
                     {totalAllocation}%
                  </span>
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total</span>
                </div>
             </div>

             {/* Status Badge */}
             <div className="mt-4">
                {totalAllocation !== 100 ? (
                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
                      <AlertTriangle size={12} /> Incomplete
                   </span>
                ) : (
                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold">
                      <CheckCircle size={12} /> Valid Allocation
                   </span>
                )}
             </div>
          </div>

          <div className="px-6 pb-6 space-y-4">
             {/* Key Metrics */}
             <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500 flex items-center gap-1"><TrendingUp size={14}/> Exp. Return</span>
                   <span className="font-bold text-green-600">6.8% - 8.2%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500 flex items-center gap-1"><DollarSign size={14}/> Est. Fees</span>
                   <span className="font-bold text-gray-900">0.08% / yr</span>
                </div>
                <div className="space-y-1">
                   <div className="flex justify-between text-xs text-gray-500">
                      <span>Conservative</span>
                      <span>Aggressive</span>
                   </div>
                   <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-accent w-[65%] rounded-full"></div>
                   </div>
                </div>
             </div>
             
             <Button 
                onClick={() => { onUpdateInvestments(localFunds); onNext(); }} 
                disabled={totalAllocation !== 100}
                className="w-full justify-center text-base py-3 shadow-lg shadow-blue-500/20"
             >
                Confirm Allocation
             </Button>

             <div className="grid grid-cols-2 gap-3">
                <Button variant="ghost" size="sm" className="w-full justify-center text-xs text-gray-500 border border-gray-100" icon={Download}>Preview PDF</Button>
                <Button variant="ghost" size="sm" className="w-full justify-center text-xs text-gray-500 border border-gray-100" icon={Bot}>Ask AI</Button>
             </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center px-4">
           Investment suggestions are educational. For personalized advice contact a licensed advisor.
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* 1. Header with Breadcrumb & Pattern */}
      <div className="relative mb-8">
         <div className="absolute top-0 right-0 w-64 h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
         <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>Dashboard</span> <ArrowRight size={14} className="text-gray-300"/> 
            <span>Invest</span> <ArrowRight size={14} className="text-gray-300"/> 
            <span className="font-bold text-primary bg-blue-50 px-2 py-0.5 rounded text-xs">Election</span>
         </div>
         <h1 className="text-3xl font-display font-bold text-gray-900">Investment Elections</h1>
         <p className="text-gray-500">Choose how your contributions are invested.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content (Left 8 Cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* 2. Premium Tabs */}
          <div className="flex border-b border-gray-200">
            {[
              { id: 'AI', label: 'AI Suggested', icon: Sparkles },
              { id: 'MANUAL', label: 'Manual', icon: Sliders },
              { id: 'ADVISOR', label: 'Advisor-managed', icon: User },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-8 py-4 text-sm transition-all duration-300 relative ${
                  activeTab === tab.id 
                    ? 'text-primary font-bold' 
                    : 'text-gray-500 hover:text-gray-800 font-medium'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-accent' : 'text-gray-400'} />
                {tab.label}
                {/* Active Gradient Underline */}
                {activeTab === tab.id && (
                   <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-accent rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* TAB CONTENT: AI SUGGESTED */}
          {activeTab === 'AI' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
               
               {/* Section Header */}
               <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-gray-900 text-lg">Recommended Strategies</h3>
                  <span className="text-sm text-gray-500">Based on your risk profile</span>
               </div>

               {/* 3. Portfolio Cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PORTFOLIOS.map(p => {
                    const isSelected = selectedPortfolioId === p.id;
                    return (
                      <div 
                         key={p.id} 
                         className={`relative rounded-2xl p-6 transition-all duration-300 border-2 flex flex-col justify-between min-h-[260px] ${
                           isSelected 
                             ? 'border-accent bg-gradient-to-b from-teal-50/50 to-white shadow-glow' 
                             : 'border-transparent bg-white shadow-premium hover:-translate-y-1 hover:shadow-2xl'
                         }`}
                      >
                         {isSelected && (
                            <div className="absolute -top-3 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                               <CheckCircle size={12} fill="white" className="text-accent"/> Selected
                            </div>
                         )}
                         {p.riskLabel === 'Balanced' && !isSelected && (
                            <div className="absolute -top-3 left-4 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                               {p.fitScore}% FIT
                            </div>
                         )}

                         <div>
                            <div className="flex justify-between items-start mb-4">
                               <div className="p-3 bg-gray-50 rounded-xl text-primary">
                                  <PieIcon size={24} />
                               </div>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-2">{p.name}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-4">{p.description}</p>
                         </div>
                         
                         <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs font-semibold bg-gray-50 px-3 py-2 rounded-lg">
                               <span className="text-gray-500">Return</span>
                               <span className="text-green-600">{p.expectedReturnRange}</span>
                            </div>
                            <Button 
                               onClick={() => applyPortfolio(p)}
                               className={`w-full justify-center transition-transform active:scale-95 ${isSelected ? 'bg-accent hover:bg-teal-600 ring-2 ring-offset-2 ring-accent' : ''}`}
                            >
                               {isSelected ? 'Applied' : 'Use This'}
                            </Button>
                         </div>
                      </div>
                    );
                  })}
               </div>

               {/* 4. Allocation Workspace (Grouped Card) */}
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                     <div className="flex items-center gap-2">
                        <Sliders size={20} className="text-primary"/>
                        <h3 className="font-display font-bold text-gray-900 text-lg">Allocation Workspace</h3>
                     </div>
                     <div className="flex gap-3">
                        <button 
                           onClick={normalizeAllocation} 
                           disabled={totalAllocation === 0}
                           className="px-4 py-2 rounded-full border border-gray-300 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-primary hover:text-primary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                           <CheckCircle size={14}/> Auto-normalize
                        </button>
                        <Button size="sm" icon={Plus}>Add Fund</Button>
                     </div>
                  </div>
                  
                  <div className="p-6 space-y-4 bg-white">
                     {localFunds.map(fund => (
                        <FundRow key={fund.id} fund={fund} onAllocationChange={handleAllocationChange} />
                     ))}
                  </div>
               </div>
            </div>
          )}

          {/* TAB CONTENT: MANUAL */}
          {activeTab === 'MANUAL' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                {/* 6. Filter & Search Panel */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                       <div className="relative flex-1">
                          <Search className="absolute left-4 top-3.5 text-gray-400" size={20}/>
                          <input 
                             type="text" 
                             placeholder="Search funds by name or ticker..." 
                             className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                          />
                       </div>
                       <Button variant="outline" icon={Filter} className="px-6">More Filters</Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                       {['Equity', 'Fixed Income', 'Target Date', 'Index', 'ESG', 'Low Fee'].map(f => (
                          <span key={f} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-primary hover:text-primary cursor-pointer transition shadow-sm">
                             {f}
                          </span>
                       ))}
                    </div>
                </div>

                {/* Apply to All Toggle */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                               <Info size={20} className="text-primary"/>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Apply same investments for all sources</h4>
                                <p className="text-xs text-gray-500">Automatically syncs allocation across 401(k), IRA, and HSA.</p>
                            </div>
                        </div>
                        <div 
                            className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${applyToAllSources ? 'bg-primary' : 'bg-gray-300'}`}
                            onClick={() => setApplyToAllSources(!applyToAllSources)}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${applyToAllSources ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    {applyToAllSources && (
                        <div className="pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                            {SOURCES_COMPATIBILITY.map(source => (
                                <div key={source.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${source.compatible ? 'bg-green-50/50 border-green-100' : 'bg-amber-50/50 border-amber-100'}`}>
                                    <div className={`mt-0.5 p-1 rounded-full ${source.compatible ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {source.compatible ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-gray-900">{source.name}</div>
                                        {!source.compatible && (
                                            <div className="text-xs text-amber-700 mt-1">{source.issue}</div>
                                        )}
                                    </div>
                                    {!source.compatible && (
                                        <button className="text-xs font-bold text-amber-700 hover:text-amber-800 underline">Resolve</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Workspace Reuse */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                       <h3 className="font-display font-bold text-gray-900 text-lg">Allocation Workspace</h3>
                    </div>
                    <div className="p-6 space-y-4">
                       {localFunds.map(fund => (
                          <FundRow key={fund.id} fund={fund} onAllocationChange={handleAllocationChange} />
                       ))}
                    </div>
                </div>
             </div>
          )}

          {/* TAB CONTENT: ADVISOR */}
          {activeTab === 'ADVISOR' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                
                {/* 7. Split Advisor Cards */}
                
                {/* Card A: AI Advisor */}
                <div className="bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                   <div className="w-full md:w-1/3 bg-gradient-to-br from-primary to-blue-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="relative z-10">
                         <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
                            <Sparkles className="text-white" size={24}/>
                         </div>
                         <h3 className="text-2xl font-display font-bold mb-2">RetireReady AI</h3>
                         <p className="text-blue-100 text-sm">24/7 personalized portfolio guidance driven by market data.</p>
                      </div>
                      <div className="relative z-10 pt-8">
                         <div className="flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online Now
                         </div>
                      </div>
                   </div>

                   <div className="w-full md:w-2/3 p-6 flex flex-col h-[500px]">
                      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                         {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                               <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                                  msg.role === 'user' 
                                    ? 'bg-primary text-white rounded-br-none' 
                                    : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-none'
                               }`}>
                                  <p>{msg.text}</p>
                                  {msg.actions && (
                                     <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-200/50">
                                        {msg.actions.map((act, i) => (
                                           <button key={i} className="px-3 py-1.5 bg-white border border-gray-200 text-primary rounded-lg text-xs font-bold hover:bg-blue-50 transition shadow-sm">
                                              {act.label}
                                           </button>
                                        ))}
                                     </div>
                                  )}
                               </div>
                            </div>
                         ))}
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-100">
                         <div className="relative">
                            <input 
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                              type="text" 
                              placeholder="Ask to create a portfolio..." 
                              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                            />
                            <button onClick={handleChatSend} className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-lg hover:bg-blue-600 transition shadow-sm">
                               <ArrowUpRight size={18}/>
                            </button>
                         </div>
                         <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                            {['Recommend portfolio', 'Explain risk', 'Simulate +2%'].map(chip => (
                               <button key={chip} onClick={() => setChatInput(chip)} className="whitespace-nowrap px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-200 transition">
                                  {chip}
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Card B: Human Advisor */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-gray-900 text-lg">Available Human Advisors</h3>
                      <button className="text-sm text-primary font-bold hover:underline">View Directory</button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ADVISORS.map(advisor => (
                         <div key={advisor.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
                            <div className="flex items-start gap-4 mb-4">
                               <div className="relative">
                                  <img src={advisor.photoUrl} alt={advisor.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"/>
                                  {advisor.isOnline && <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>}
                               </div>
                               <div>
                                  <h4 className="font-bold text-lg text-gray-900">{advisor.name}</h4>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                     {advisor.credentials.map(c => (
                                        <span key={c} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-100">{c}</span>
                                     ))}
                                  </div>
                               </div>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                               <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">Rating</span>
                                  <span className="font-bold flex items-center gap-1">{advisor.rating} <span className="text-yellow-400">★</span></span>
                               </div>
                               <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">Next Available</span>
                                  <span className="font-bold text-green-600">{advisor.nextAvailableSlot}</span>
                               </div>
                            </div>

                            <Button onClick={() => { setSelectedAdvisor(advisor); setShowAdvisorModal(true); }} className="w-full justify-center">
                               Book Consultation
                            </Button>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Sidebar (Right 4 Cols) */}
        <div className="col-span-12 lg:col-span-4 h-full">
           <Sidebar />
        </div>
      </div>

      {/* Booking Modal */}
      {showAdvisorModal && selectedAdvisor && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md !p-0 overflow-hidden shadow-2xl">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-display font-bold text-xl">Book Session</h3>
                  <button onClick={() => setShowAdvisorModal(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition"><X size={20}/></button>
               </div>
               <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                     <img src={selectedAdvisor.photoUrl} className="w-12 h-12 rounded-full border-2 border-white shadow-sm"/>
                     <div>
                        <div className="font-bold text-gray-900">{selectedAdvisor.name}</div>
                        <div className="text-xs text-blue-600 font-medium">{selectedAdvisor.credentials.join(', ')}</div>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <label className="text-sm font-bold text-gray-700">Select Date & Time</label>
                     <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 border-2 border-primary bg-blue-50 text-primary rounded-xl text-sm font-bold shadow-sm">Today, 2:00 PM</button>
                        <button className="p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition">Tomorrow, 10 AM</button>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-sm font-bold text-gray-700">Meeting Type</label>
                     <div className="flex gap-2">
                        {[
                           { icon: Video, label: 'Video' },
                           { icon: Phone, label: 'Phone' },
                           { icon: MapPin, label: 'In-Person' }
                        ].map(m => (
                           <button key={m.label} className="flex-1 py-3 border border-gray-200 rounded-xl flex flex-col items-center gap-1 hover:border-primary hover:bg-blue-50 hover:text-primary transition group">
                              <m.icon size={18} className="text-gray-400 group-hover:text-primary"/>
                              <span className="text-xs font-medium">{m.label}</span>
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <label className="flex items-start gap-3 text-xs text-gray-600 bg-gray-50 p-4 rounded-xl cursor-pointer hover:bg-gray-100 transition border border-transparent hover:border-gray-200">
                     <input type="checkbox" className="mt-0.5 rounded text-primary focus:ring-primary"/>
                     <span>
                        I consent to share my current portfolio draft and financial profile with this advisor for the purpose of this meeting.
                     </span>
                  </label>
               </div>
               <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                  <Button variant="ghost" onClick={() => setShowAdvisorModal(false)}>Cancel</Button>
                  <Button onClick={() => setShowAdvisorModal(false)} className="shadow-lg shadow-blue-500/20">Confirm Booking</Button>
               </div>
            </Card>
         </div>
      )}
    </div>
  );
};
