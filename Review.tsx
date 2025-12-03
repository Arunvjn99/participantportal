import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Download, Mail, ChevronRight, AlertTriangle, 
  TrendingUp, Shield, PieChart as PieIcon, RefreshCw, Sparkles, 
  ArrowRight, Edit3, Info, DollarSign, Target, FileText, Bot
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Button, Card, Badge } from '../components/UIComponents';
import { UserState, AppStep } from '../types';

interface ReviewProps {
  userState: UserState;
  onConfirm: () => void;
  onEdit: (step: AppStep) => void;
}

const COLORS = ['#0B5FFF', '#00B37E', '#8B5CF6', '#F59E0B', '#EC4899'];

export const Review: React.FC<ReviewProps> = ({ userState, onConfirm, onEdit }) => {
  // Simulator State
  const [simContribution, setSimContribution] = useState(userState.contributionRate);
  const [simEquitySplit, setSimEquitySplit] = useState(80); // Default 80/20 split mock
  const [isAiOptimized, setIsAiOptimized] = useState(false);
  
  // Derived Metrics (Mock Calculation)
  const salary = userState.profile.annualSalary;
  const currentSavings = userState.profile.existingSavings;
  const yearsToRetire = userState.profile.retirementAge - userState.profile.currentAge;
  
  // Simple compound interest projection for demo
  const calculateProjection = (contribRate: number, equityPct: number) => {
    const annualContrib = salary * (contribRate / 100);
    // Equity grows at 8%, Fixed at 4%
    const blendedRate = ((equityPct / 100) * 0.08) + ((1 - (equityPct / 100)) * 0.04);
    
    let balance = currentSavings;
    for (let i = 0; i < yearsToRetire; i++) {
        balance = (balance + annualContrib) * (1 + blendedRate);
    }
    return Math.round(balance);
  };

  const projectedBalance = calculateProjection(simContribution, simEquitySplit);
  const monthlyIncome = Math.round(projectedBalance * 0.04 / 12); // 4% rule
  const goal = userState.profile.desiredRetirementIncome || Math.round(salary * 0.8 / 12);
  const readinessScore = Math.min(100, Math.round((monthlyIncome / goal) * 100));
  const replacementRate = Math.round((monthlyIncome * 12 / salary) * 100);
  const surplus = monthlyIncome - goal;

  // Handlers
  const handleAiOptimize = () => {
    setIsAiOptimized(true);
    setSimContribution(12); // AI suggests 12%
    setSimEquitySplit(90);  // AI suggests 90% equity
  };

  const handleReset = () => {
    setIsAiOptimized(false);
    setSimContribution(userState.contributionRate);
    setSimEquitySplit(80);
  };

  const investmentData = userState.investments
    .filter(f => f.allocation > 0)
    .map(f => ({ name: f.ticker, value: f.allocation }));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-500 pb-24">
      
      {/* HEADER */}
      <div className="space-y-2">
         <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span> <ChevronRight size={14}/> 
            <span>Invest</span> <ChevronRight size={14}/> 
            <span className="font-bold text-primary bg-blue-50 px-2 py-0.5 rounded text-xs">Review</span>
         </div>
         <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Review Your Retirement Plan</h1>
              <p className="text-gray-500">Verify your selections, explore scenarios, and finalize your retirement strategy.</p>
            </div>
            <div className="text-right">
               <div className="text-sm text-gray-400 font-medium">Draft Saved</div>
               <div className="text-xs text-gray-300">Last auto-save: Just now</div>
            </div>
         </div>
      </div>

      {/* SECTION 1: RETIREMENT GOAL SIMULATOR (Redesigned) */}
      <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-white/60">
        {/* Soft Enterprise Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E9F3FF] via-[#CFE3FF] to-[#9CCAFF]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dots-spaced.png')] opacity-[0.04]"></div>
        
        {/* Tiny Inset Highlight */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/60"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 items-stretch">
           
           {/* LEFT SIDE: Score + Metrics (7 Cols) */}
           <div className="lg:col-span-7 flex flex-col justify-between gap-8 py-2">
              
              {/* Top Row: Score Circle + Big Balance */}
              <div className="flex items-center gap-8">
                 {/* Score Circle */}
                 <div className="relative w-40 h-40 flex-shrink-0 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm ring-4 ring-white/30">
                    <svg className="w-full h-full transform -rotate-90 p-1">
                       <circle cx="76" cy="76" r="68" stroke="#1F2937" strokeWidth="6" fill="transparent" className="opacity-5" />
                       <circle cx="76" cy="76" r="68" stroke="url(#gradientScore)" strokeWidth="6" fill="transparent" strokeLinecap="round"
                         strokeDasharray={427} strokeDashoffset={427 - (427 * readinessScore) / 100} 
                         className="transition-all duration-1000 ease-out" 
                       />
                       <defs>
                          <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="#0B5FFF" />
                             <stop offset="100%" stopColor="#00B37E" />
                          </linearGradient>
                       </defs>
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#111827]">
                       <span className="font-display font-semibold text-[42px] leading-none">{readinessScore}</span>
                       <span className="text-[10px] font-bold tracking-[0.05em] uppercase mt-1 opacity-50">Score</span>
                    </div>
                 </div>

                 {/* Balance Text */}
                 <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Projected Balance at Age {userState.profile.retirementAge}</h3>
                    <div className="text-5xl font-display font-bold text-[#111827] tracking-tighter">
                       ${projectedBalance.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-600/10 text-teal-800 border border-teal-600/20 text-xs font-bold">
                          <TrendingUp size={12} strokeWidth={3} /> On Track
                       </span>
                       {isAiOptimized && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary animate-pulse">
                             <Sparkles size={12} /> AI Optimized
                          </span>
                       )}
                    </div>
                 </div>
              </div>

              {/* Bottom Row: Metrics Tiles */}
              <div className="grid grid-cols-3 gap-6">
                 <div className="p-5 rounded-xl bg-white/40 border border-white/50 backdrop-blur-sm shadow-sm">
                    <div className="text-xs font-bold text-gray-500 mb-1">Monthly Income</div>
                    <div className="text-2xl font-display font-bold text-[#111827]">${monthlyIncome.toLocaleString()}</div>
                    <div className="text-[11px] text-gray-500 font-medium mt-1">Goal: ${goal.toLocaleString()}</div>
                 </div>
                 <div className="p-5 rounded-xl bg-white/40 border border-white/50 backdrop-blur-sm shadow-sm">
                    <div className="text-xs font-bold text-gray-500 mb-1">Replacement Rate</div>
                    <div className="text-2xl font-display font-bold text-[#111827]">{replacementRate}%</div>
                    <div className="text-[11px] text-gray-500 font-medium mt-1">Target: 80%</div>
                 </div>
                 <div className="p-5 rounded-xl bg-white/40 border border-white/50 backdrop-blur-sm shadow-sm">
                    <div className="text-xs font-bold text-gray-500 mb-1">Gap / Surplus</div>
                    {surplus >= 0 ? (
                        <div className="text-2xl font-display font-bold text-teal-700">+${surplus.toLocaleString()}</div>
                    ) : (
                        <div className="text-2xl font-display font-bold text-orange-600">-${Math.abs(surplus).toLocaleString()}</div>
                    )}
                    <div className="text-[11px] text-gray-500 font-medium mt-1">Monthly</div>
                 </div>
              </div>
           </div>

           {/* RIGHT SIDE: Simulator (5 Cols) */}
           <div className="lg:col-span-5 bg-white/60 backdrop-blur-md rounded-xl p-8 border border-white/60 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 text-[#111827] font-bold mb-8">
                 <div className="p-1.5 bg-white rounded-md shadow-sm text-primary"><RefreshCw size={16}/></div>
                 Goal Simulator
                 <div className="group relative">
                    <Info size={14} className="text-gray-400 cursor-help hover:text-primary transition-colors"/>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                        Simulations do not change your real selections until you confirm below.
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 {/* Contribution Slider */}
                 <div>
                    <div className="flex justify-between mb-3 items-end">
                       <label className="text-sm font-bold text-gray-700">Contribution Rate</label>
                       <span className="text-2xl font-display font-bold text-primary">{simContribution}%</span>
                    </div>
                    <input 
                       type="range" min="0" max="20" step="0.5"
                       value={simContribution}
                       onChange={(e) => setSimContribution(Number(e.target.value))}
                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-blue-600 transition-all"
                    />
                 </div>

                 {/* Investment Mix Slider */}
                 <div>
                    <div className="flex justify-between mb-3 items-end">
                       <label className="text-sm font-bold text-gray-700">Investment Mix</label>
                       <span className="text-2xl font-display font-bold text-teal-600">{simEquitySplit}% <span className="text-sm text-gray-400 font-medium">Equity</span></span>
                    </div>
                    <input 
                       type="range" min="0" max="100" step="5"
                       value={simEquitySplit}
                       onChange={(e) => setSimEquitySplit(Number(e.target.value))}
                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-600 transition-all"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wide px-1">
                       <span>Conservative</span>
                       <span>Balanced</span>
                       <span>Aggressive</span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-8 mt-auto">
                 <button 
                    onClick={handleAiOptimize}
                    className="flex-1 bg-gradient-to-r from-[#0B5FFF] to-[#00B37E] text-white font-bold py-3 px-4 rounded-lg text-sm shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                 >
                    <Sparkles size={16} className="text-blue-100" /> Apply AI Scenario
                 </button>
                 <button 
                    onClick={handleReset}
                    className="bg-white border border-blue-200 text-gray-600 font-bold py-3 px-6 rounded-lg text-sm hover:bg-blue-50 hover:text-primary transition-all"
                 >
                    Reset
                 </button>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* LEFT COLUMN (8 Cols) */}
         <div className="lg:col-span-8 space-y-8">
            
            {/* SECTION 2: PLAN SUMMARY & SECTION 3: CONTRIBUTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plan Summary Card */}
                <Card className="flex flex-col h-full relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                   
                   <div className="mb-6 relative z-10">
                      <div className="flex justify-between items-start mb-2">
                         <div className="p-2 bg-blue-100 rounded-lg text-primary w-fit"><Shield size={20}/></div>
                         <Button variant="ghost" size="sm" onClick={() => onEdit(AppStep.PLAN_SELECTION)} className="text-xs hover:bg-blue-50">Change</Button>
                      </div>
                      <h3 className="font-display font-bold text-gray-900 text-lg">Selected Plan</h3>
                      <div className="text-3xl font-display font-bold text-primary mt-1">401(k)</div>
                      <Badge color="teal" className="mt-2 inline-flex items-center gap-1"><CheckCircle size={10}/> AI Match Score: 94%</Badge>
                   </div>

                   <div className="space-y-4 flex-1">
                      <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Match Rate</span>
                            <span className="font-bold text-gray-900">100% up to 6%</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Vesting</span>
                            <span className="font-bold text-gray-900">Immediate</span>
                         </div>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                         <Info size={12}/> 2025 IRS Limit: $23,500
                      </div>
                   </div>
                </Card>

                {/* Contribution Strategy Card */}
                <Card className="flex flex-col h-full">
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                         <div className="p-2 bg-green-100 rounded-lg text-green-700"><DollarSign size={20}/></div>
                         <h3 className="font-display font-bold text-gray-900">Contribution</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(AppStep.CONTRIBUTION)} icon={Edit3} className="text-xs"/>
                   </div>

                   <div className="text-center mb-6 py-4 border-b border-gray-100">
                      <span className="text-4xl font-display font-bold text-gray-900">{userState.contributionRate}%</span>
                      <p className="text-sm text-gray-500">of annual salary</p>
                   </div>

                   <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                         <span className="text-sm font-bold text-gray-700">Pre-tax</span>
                         <span className="text-sm font-bold text-primary">{userState.contributionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 opacity-60">
                         <span className="text-sm font-bold text-gray-500">Roth</span>
                         <span className="text-sm font-bold text-gray-400">0%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg mt-2">
                         <Sparkles size={12} className="shrink-0"/>
                         <span>AI Insight: Pre-tax lowers your taxable income now.</span>
                      </div>
                   </div>
                </Card>
            </div>

            {/* SECTION 4: INVESTMENT SUMMARY */}
            <Card className="space-y-6">
               <div className="flex justify-between items-center">
                  <div>
                     <h3 className="font-display font-bold text-gray-900 text-lg">Investment Allocation</h3>
                     <p className="text-sm text-gray-500">Your portfolio mix</p>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="ghost" size="sm" icon={Bot}>Ask AI Insight</Button>
                     <Button variant="outline" size="sm" onClick={() => onEdit(AppStep.INVESTMENTS)}>Edit Investments</Button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="col-span-1 flex flex-col items-center justify-center relative">
                     <div className="w-40 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie data={investmentData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                 {investmentData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none"/>
                                 ))}
                              </Pie>
                              <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                           </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                           <span className="font-bold text-gray-900 text-xl">{investmentData.length}</span>
                           <span className="text-[10px] text-gray-400 uppercase">Funds</span>
                        </div>
                     </div>
                  </div>

                  <div className="col-span-2 space-y-4">
                     {/* Stats Row */}
                     <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                           <div className="text-xs text-gray-500 mb-1">Avg Fee</div>
                           <div className="font-bold text-gray-900">0.08%</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl text-center">
                           <div className="text-xs text-green-600 mb-1">Exp Return</div>
                           <div className="font-bold text-green-700">7-9%</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-xl text-center">
                           <div className="text-xs text-orange-600 mb-1">Volatility</div>
                           <div className="font-bold text-orange-700">Med-High</div>
                        </div>
                     </div>

                     {/* Fund List Preview */}
                     <div className="space-y-2">
                        {userState.investments.filter(f => f.allocation > 0).slice(0, 3).map((fund, i) => (
                           <div key={fund.id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer relative">
                              <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                                 <span className="font-medium text-gray-700">{fund.name}</span>
                              </div>
                              <span className="font-bold text-gray-900">{fund.allocation}%</span>
                              
                              {/* Hover Insight */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl">
                                 AI Insight: {fund.name} provides broad market exposure with low fees. Good anchor for growth.
                              </div>
                           </div>
                        ))}
                        {investmentData.length > 3 && (
                           <div className="text-xs text-center text-gray-400 pt-2 border-t border-gray-100">
                              + {investmentData.length - 3} more funds
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </Card>

         </div>

         {/* RIGHT COLUMN (4 Cols) */}
         <div className="lg:col-span-4 space-y-6">
            
            {/* SECTION 5: RISK INDICATOR */}
            <Card className="bg-white border-l-4 border-l-orange-500">
               <h3 className="font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-orange-500"/> Risk Profile
               </h3>
               
               <div className="relative pt-4 pb-8 text-center">
                  <div className="h-4 w-full bg-gradient-to-r from-blue-300 via-teal-300 to-orange-400 rounded-full relative">
                     <div className="absolute -top-1.5 left-[75%] w-7 h-7 bg-white border-4 border-orange-500 rounded-full shadow-md transform -translate-x-1/2"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                     <span>Conservative</span>
                     <span>Aggressive</span>
                  </div>
               </div>

               <div className="text-center mb-4">
                  <div className="text-xl font-bold text-gray-900">Moderate Aggressive</div>
                  <p className="text-xs text-gray-500 mt-1">
                     Aligned with your age ({userState.profile.currentAge}) and goal.
                  </p>
               </div>

               <Button variant="ghost" size="sm" className="w-full text-xs border border-gray-200" icon={Sparkles}>Does this suit me?</Button>
            </Card>

            {/* AI Assistant Teaser */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
               <Sparkles className="mb-4" size={24}/>
               <h4 className="font-bold text-lg mb-2">Need a second opinion?</h4>
               <p className="text-indigo-100 text-sm mb-4">Our AI can analyze your mix against 10,000+ market scenarios.</p>
               <Button size="sm" className="bg-white text-indigo-700 w-full hover:bg-indigo-50 border-none shadow-none">Run Analysis</Button>
            </div>
         </div>

      </div>

      {/* SECTION 6: FINAL CONFIRMATION */}
      <div className="bg-white rounded-2xl shadow-premium border border-gray-200 overflow-hidden mt-8">
         <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-4">
               <h3 className="text-2xl font-display font-bold text-gray-900">Ready to Enroll?</h3>
               <div className="flex flex-wrap gap-4">
                  {[
                     'Plan Selected', 'Contribution Set', 'Investments Chosen', 'Tax Type Confirmed'
                  ].map(item => (
                     <div key={item} className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <CheckCircle size={14} className="text-teal-500"/> {item}
                     </div>
                  ))}
               </div>
               <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
                  By clicking Confirm, you agree to the Plan Terms. Investment suggestions are educational and not financial advice. 
                  Past performance does not guarantee future results.
               </p>
            </div>

            <div className="lg:col-span-2 flex flex-col md:flex-row gap-4 justify-end items-center">
               <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Button variant="ghost" size="sm" icon={Download} className="text-gray-500">Download PDF</Button>
                  <Button variant="ghost" size="sm" icon={Mail} className="text-gray-500">Email Summary</Button>
               </div>
               <Button onClick={onConfirm} className="w-full md:w-auto px-12 py-4 text-lg shadow-xl shadow-blue-600/20 group">
                  Confirm Enrollment <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
               </Button>
            </div>

         </div>
      </div>

    </div>
  );
};