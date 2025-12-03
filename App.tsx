import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, ChevronRight, DollarSign, PieChart, 
  Settings, User, Download, ArrowLeft, BarChart2 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart as RePieChart, Pie, Cell } from 'recharts';

import { Login } from './views/Login';
import { PreEnrollment } from './views/PreEnrollment';
import { ForgotPasswordEmail, ForgotPasswordOTP, ForgotPasswordReset, ForgotPasswordSuccess } from './views/ForgotPassword';
import { OnboardingWizard } from './views/OnboardingWizard';
import { InvestmentElections } from './views/InvestmentElections';
import { Review } from './views/Review'; // New Import
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { Button, Card, Badge, ProgressBar } from './components/UIComponents';
import { AppStep, UserState, Plan, InvestmentFund, UserProfile } from './types';
import { getAIRecommendation } from './services/geminiService';

// --- MOCK DATA ---
const PLANS: Plan[] = [
  {
    id: 'p1', name: 'Traditional 401(k)', type: '401(k)', match: '100% up to 6%',
    description: 'Contributions are pre-tax. You pay taxes upon withdrawal in retirement.',
    features: ['Pre-tax contributions', 'Immediate tax break', 'Employer Match'],
    recommended: true, fitScore: 92
  },
  {
    id: 'p2', name: 'Roth 401(k)', type: 'Roth 401(k)', match: '100% up to 6%',
    description: 'Contributions are after-tax. Withdrawals in retirement are tax-free.',
    features: ['Tax-free growth', 'Tax-free withdrawal', 'Employer Match'],
    fitScore: 78
  }
];

const FUNDS: InvestmentFund[] = [
  { 
    id: 'f1', name: 'Vanguard Total Stock', ticker: 'VTI', family: 'Vanguard',
    assetClass: 'Equity', type: 'Equity', sourceType: 'Plan',
    expenseRatio: 0.03, riskLevel: 8, allocation: 0, returns: [10, 12, 15, 14, 18, 22] 
  },
  { 
    id: 'f2', name: 'Vanguard Total Bond', ticker: 'BND', family: 'Vanguard',
    assetClass: 'Fixed Income', type: 'Bond', sourceType: 'Plan',
    expenseRatio: 0.05, riskLevel: 3, allocation: 0, returns: [2, 3, 2.5, 3, 3.5, 4] 
  },
  { 
    id: 'f3', name: 'Intl Growth Fund', ticker: 'VXUS', family: 'Vanguard',
    assetClass: 'Equity', type: 'Equity', sourceType: 'Plan',
    expenseRatio: 0.08, riskLevel: 9, allocation: 0, returns: [8, 9, 11, 10, 14, 16] 
  },
  { 
    id: 'f4', name: 'Target Retirement 2060', ticker: 'VTTSX', family: 'Vanguard',
    assetClass: 'Target Date', type: 'Target Date', sourceType: 'Plan',
    expenseRatio: 0.08, riskLevel: 6, allocation: 0, returns: [6, 8, 9, 10, 12, 14] 
  },
];

const INITIAL_PROFILE: UserProfile = {
  currentAge: 30,
  retirementAge: 65,
  annualSalary: 85000,
  salaryGrowth: 3,
  existingSavings: 15000,
  otherSavings: 5000,
  riskTolerance: 'AI',
  desiredRetirementIncome: 6000,
  isIncomeGoalAutomated: true,
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    name: 'Satish',
    profile: INITIAL_PROFILE,
    selectedPlanId: null,
    contributionRate: 6,
    autoIncrease: true,
    autoIncreaseStep: 1,
    autoIncreaseCap: 15,
    autoIncreaseStartYear: 2025,
    investments: FUNDS,
    step: AppStep.LOGIN,
  });

  // --- HANDLERS ---
  const handleLogin = () => setUser({ ...user, isLoggedIn: true, step: AppStep.DASHBOARD_PRE });
  const handleStart = () => setUser({ ...user, step: AppStep.ONBOARDING });
  
  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser({ ...user, profile, step: AppStep.PLAN_SELECTION });
  };
  const handleOnboardingCancel = () => {
    setUser({ ...user, step: AppStep.DASHBOARD_PRE });
  };

  const handlePlanSelect = (id: string) => setUser({ ...user, selectedPlanId: id, step: AppStep.CONTRIBUTION });
  const handleContributionNext = () => setUser({ ...user, step: AppStep.INVESTMENTS });
  
  const handleInvestmentUpdate = (newFunds: InvestmentFund[]) => {
    setUser({ ...user, investments: newFunds });
  };

  const handleInvestmentNext = () => setUser({ ...user, step: AppStep.REVIEW });
  const handleInvestmentBack = () => setUser({ ...user, step: AppStep.CONTRIBUTION });
  
  const handleReviewEdit = (step: AppStep) => setUser({ ...user, step });

  const handleConfirm = () => setUser({ ...user, step: AppStep.DASHBOARD_POST });
  
  // Forgot Password Flow Handlers
  const handleForgotPassword = () => setUser({ ...user, step: AppStep.FORGOT_PASSWORD_EMAIL });
  const handleToLogin = () => setUser({ ...user, step: AppStep.LOGIN });
  const handleEmailSubmitted = () => setUser({ ...user, step: AppStep.FORGOT_PASSWORD_OTP });
  const handleOtpVerified = () => setUser({ ...user, step: AppStep.FORGOT_PASSWORD_RESET });
  const handlePasswordReset = () => setUser({ ...user, step: AppStep.FORGOT_PASSWORD_SUCCESS });

  // --- SUB-VIEWS (Inline for simple views, imported for complex ones) ---
  
  // 1. Plan Selection View
  const PlanSelectionView = () => (
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl font-display font-bold">Choose your plan</h2>
        <div className="grid gap-6">
          {PLANS.map(plan => (
            <Card key={plan.id} hoverEffect className={`relative border-2 ${plan.recommended ? 'border-teal-500' : 'border-transparent'}`}>
              {plan.recommended && (
                <div className="absolute -top-3 left-6 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  AI Recommended • {plan.fitScore}% Fit
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 mt-1">{plan.match} Match</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg"><DollarSign className="text-primary"/></div>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <div className="flex gap-4 items-center">
                <Button onClick={() => handlePlanSelect(plan.id)}>Select Plan</Button>
                <div className="flex gap-2">
                  {plan.features.map(f => <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{f}</span>)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="space-y-6">
         <Card className="bg-gradient-to-br from-white to-blue-50">
           <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white"><User size={16}/></div>
             <span className="font-bold">Why we recommend Traditional</span>
           </div>
           <p className="text-sm text-gray-600 italic mb-4">
             "Based on your current tax bracket (24%), deferring taxes now is mathematically advantageous compared to paying them today."
           </p>
           <Button variant="ghost" size="sm" className="text-primary w-full text-left p-0 hover:bg-transparent">Read full analysis &rarr;</Button>
         </Card>
         
         {/* Profile Summary Widget */}
         <Card className="bg-gray-50">
            <h4 className="font-bold text-gray-800 mb-3 text-sm">Your Profile</h4>
            <div className="text-sm space-y-2">
               <div className="flex justify-between"><span>Age</span> <span className="font-semibold">{user.profile.currentAge}</span></div>
               <div className="flex justify-between"><span>Retire At</span> <span className="font-semibold">{user.profile.retirementAge}</span></div>
               <div className="flex justify-between"><span>Risk</span> <span className="font-semibold text-primary">{user.profile.riskTolerance}</span></div>
            </div>
         </Card>
      </div>
    </div>
  );

  // 2. Contribution View
  const ContributionView = () => {
    const projectionData = Array.from({length: 30}, (_, i) => ({
      year: new Date().getFullYear() + i,
      balance: Math.pow(1.07, i) * (user.profile.existingSavings + (user.profile.annualSalary * (user.contributionRate/100) * 2 * i)) // Rough compounding logic
    }));

    return (
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">Contribution Rate</h2>
            <p className="text-gray-500">How much of your paycheck do you want to save?</p>
          </div>
          
          <Card className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <button onClick={() => setUser(u => ({...u, contributionRate: Math.max(1, u.contributionRate - 0.5)}))} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-2xl font-light">-</button>
              <div className="text-center">
                <span className="text-6xl font-display font-bold text-primary">{user.contributionRate}%</span>
                <p className="text-gray-400 mt-2">of your annual salary</p>
              </div>
              <button onClick={() => setUser(u => ({...u, contributionRate: Math.min(20, u.contributionRate + 0.5)}))} className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-blue-700 text-2xl shadow-lg shadow-blue-200">+</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
               <div className="p-4 bg-gray-50 rounded-xl">
                 <div className="text-xs text-gray-500 uppercase tracking-wide">You Contribute</div>
                 <div className="text-xl font-bold text-gray-900">${(user.profile.annualSalary * user.contributionRate / 100).toLocaleString()}</div>
               </div>
               <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                 <div className="text-xs text-blue-600 uppercase tracking-wide">Employer Match</div>
                 <div className="text-xl font-bold text-blue-700">${(user.profile.annualSalary * 0.06).toLocaleString()}</div>
               </div>
            </div>

            {/* Auto Increase Section */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-start">
                  <div>
                      <h3 className="font-display font-bold text-xl text-gray-900">Auto Increase</h3>
                      <p className="text-sm text-gray-600 font-sans mt-1">Automatically increase your contribution each year.</p>
                  </div>
                  <div className="flex flex-col items-end">
                      <div 
                        className={`w-[40px] h-[22px] rounded-full p-0.5 cursor-pointer transition-all duration-300 ${user.autoIncrease ? 'bg-gradient-to-r from-primary to-accent' : 'bg-gray-300'}`}
                        onClick={() => setUser(u => ({...u, autoIncrease: !u.autoIncrease}))}
                      >
                        <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transform transition-transform duration-300 ${user.autoIncrease ? 'translate-x-[18px]' : 'translate-x-0'}`} />
                      </div>
                      <span className="text-xs text-gray-500 mt-2 text-right">Enable automatic<br/>yearly increase</span>
                  </div>
              </div>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${user.autoIncrease ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pt-2 pb-2 space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                              <label className="text-xs font-display font-semibold text-gray-700">Annual increase (%)</label>
                              <div className="relative">
                                <input 
                                    type="number" 
                                    value={user.autoIncreaseStep || 1}
                                    onChange={(e) => setUser({...user, autoIncreaseStep: Number(e.target.value)})}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-inner text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-sans"
                                    placeholder="1"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"></div>
                              </div>
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-display font-semibold text-gray-700">Max contribution (%)</label>
                              <div className="relative">
                                <input 
                                    type="number" 
                                    value={user.autoIncreaseCap || 15}
                                    onChange={(e) => setUser({...user, autoIncreaseCap: Number(e.target.value)})}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-inner text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-sans"
                                    placeholder="15"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"></div>
                              </div>
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-display font-semibold text-gray-700">Start in year</label>
                              <div className="relative">
                                <input 
                                    type="number" 
                                    value={user.autoIncreaseStartYear || 2025}
                                    onChange={(e) => setUser({...user, autoIncreaseStartYear: Number(e.target.value)})}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-inner text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-sans"
                                    placeholder="2025"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"></div>
                              </div>
                          </div>
                      </div>
                      <p className="text-xs text-gray-500 italic">Your contribution will automatically increase each year until it reaches your cap.</p>
                  </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm flex items-center gap-2 cursor-pointer hover:border-primary">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Safe: 8%
             </div>
             <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm flex items-center gap-2 cursor-pointer hover:border-primary">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Aggressive: 15%
             </div>
          </div>

          <Button onClick={handleContributionNext} className="w-full justify-center">Next: Investments</Button>
        </div>

        <div className="space-y-6">
           <div className="bg-neutral p-6 rounded-3xl h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="font-bold text-gray-900">Projected Growth</h3>
                   <p className="text-sm text-gray-500">At age {user.profile.retirementAge}</p>
                </div>
                <div className="text-3xl font-bold text-primary">
                   ${Math.round(projectionData[projectionData.length - 1].balance).toLocaleString()}
                </div>
              </div>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B5FFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0B5FFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}
                    formatter={(value: number) => [`$${Math.round(value).toLocaleString()}`, 'Balance']}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#0B5FFF" strokeWidth={3} fillOpacity={1} fill="url(#colorBal)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
           <Card className="!bg-teal-50 border-teal-100 flex gap-4">
             <div className="p-2 bg-teal-100 rounded-lg text-teal-600 h-fit"><CheckCircle size={20}/></div>
             <div>
               <h4 className="font-bold text-teal-900">On Track</h4>
               <p className="text-teal-700 text-sm mt-1">
                 With this rate, you are projected to replace 85% of your income in retirement. Great job!
               </p>
             </div>
           </Card>
        </div>
      </div>
    );
  };

  // 5. Post Enrollment Dashboard
  const PostEnrollmentView = () => (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-display font-bold">Dashboard</h1>
         <div className="flex gap-3">
            <Button variant="outline" size="sm" icon={Settings}>Manage</Button>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">SJ</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Balance', val: '$14,250.00', change: '+2.4%' },
           { label: 'YTD Return', val: '+8.2%', change: '' },
           { label: 'Contribution', val: `${user.contributionRate}%`, change: 'Auto-increase on' },
           { label: 'Retirement Age', val: `${user.profile.retirementAge}`, change: `${new Date().getFullYear() + (user.profile.retirementAge - user.profile.currentAge)}` }
         ].map((m, i) => (
           <Card key={i} className="py-6">
              <div className="text-sm text-gray-500 mb-1">{m.label}</div>
              <div className="text-2xl font-bold text-gray-900">{m.val}</div>
              {m.change && <div className="text-xs text-green-600 mt-2 font-medium">{m.change}</div>}
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card className="h-[400px]">
              <h3 className="font-bold mb-6">Portfolio Performance</h3>
              <ResponsiveContainer width="100%" height="85%">
                 <AreaChart data={[
                   {m: 'Jan', v: 10000}, {m: 'Feb', v: 10500}, {m: 'Mar', v: 10200}, 
                   {m: 'Apr', v: 11000}, {m: 'May', v: 11800}, {m: 'Jun', v: 12500}, 
                   {m: 'Jul', v: 13200}, {m: 'Aug', v: 14250}
                 ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="v" stroke="#0B5FFF" strokeWidth={3} fill="url(#colorBal)" fillOpacity={0.1} />
                 </AreaChart>
              </ResponsiveContainer>
           </Card>
        </div>
        <div className="space-y-6">
           <Card className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white border-none">
              <h3 className="font-bold text-lg mb-2">Next Best Action</h3>
              <p className="text-blue-100 text-sm mb-6">You have $2,000 in a previous employer 401(k). Consolidate now to simplify your portfolio.</p>
              <Button size="sm" className="bg-white text-primary w-full justify-center hover:bg-blue-50">Start Rollover</Button>
           </Card>
           
           <Card>
             <h3 className="font-bold mb-4">Vesting Schedule</h3>
             <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Year 1</span>
                  <span className="font-bold text-green-600">20% Vested</span>
                </div>
                <ProgressBar value={20} />
                <p className="text-xs text-gray-400">You become 100% vested on Jan 1, 2028</p>
             </div>
           </Card>
        </div>
      </div>
    </div>
  );

  // --- RENDER CURRENT VIEW ---
  const renderStep = () => {
    switch(user.step) {
      case AppStep.LOGIN: 
        return <Login onLogin={handleLogin} onForgotPassword={handleForgotPassword} />;
      case AppStep.FORGOT_PASSWORD_EMAIL: 
        return <ForgotPasswordEmail onNext={handleEmailSubmitted} onBack={handleToLogin} />;
      case AppStep.FORGOT_PASSWORD_OTP: 
        return <ForgotPasswordOTP onNext={handleOtpVerified} onBack={handleForgotPassword} />;
      case AppStep.FORGOT_PASSWORD_RESET: 
        return <ForgotPasswordReset onNext={handlePasswordReset} onBack={handleToLogin} />;
      case AppStep.FORGOT_PASSWORD_SUCCESS: 
        return <ForgotPasswordSuccess onComplete={handleToLogin} />;
      case AppStep.DASHBOARD_PRE: 
        return <PreEnrollment onStart={handleStart} />;
      case AppStep.ONBOARDING:
        return <OnboardingWizard 
          initialProfile={user.profile} 
          onComplete={handleOnboardingComplete} 
          onCancel={handleOnboardingCancel}
        />;
      case AppStep.PLAN_SELECTION: 
        return <PlanSelectionView />;
      case AppStep.CONTRIBUTION: 
        return <ContributionView />;
      case AppStep.INVESTMENTS: 
        return <InvestmentElections 
          userState={user} 
          onUpdateInvestments={handleInvestmentUpdate}
          onNext={handleInvestmentNext}
          onBack={handleInvestmentBack}
        />;
      case AppStep.REVIEW: 
        return <Review 
          userState={user} 
          onConfirm={handleConfirm}
          onEdit={handleReviewEdit}
        />;
      case AppStep.DASHBOARD_POST: 
        return <PostEnrollmentView />;
      default: 
        return <Login onLogin={handleLogin} onForgotPassword={handleForgotPassword} />;
    }
  };

  const isAuthFlow = [
    AppStep.LOGIN, 
    AppStep.FORGOT_PASSWORD_EMAIL, 
    AppStep.FORGOT_PASSWORD_OTP, 
    AppStep.FORGOT_PASSWORD_RESET, 
    AppStep.FORGOT_PASSWORD_SUCCESS,
    AppStep.ONBOARDING
  ].includes(user.step);

  return (
    <div className="min-h-screen bg-neutral text-gray-800 font-sans selection:bg-primary/20">
      {/* HEADER (Except Auth Pages) */}
      {!isAuthFlow && (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => user.step !== AppStep.DASHBOARD_POST && setUser({...user, step: AppStep.DASHBOARD_PRE})}>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-400 rounded-lg flex items-center justify-center text-white font-bold font-display shadow-lg shadow-blue-500/20">R</div>
              <span className="font-display font-bold text-xl tracking-tight">RetireReady</span>
            </div>
            
            {user.step !== AppStep.DASHBOARD_PRE && user.step !== AppStep.DASHBOARD_POST && (
               <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                  <span className={user.step === AppStep.PLAN_SELECTION ? 'text-primary font-bold' : ''}>Plan</span>
                  <ChevronRight size={14} />
                  <span className={user.step === AppStep.CONTRIBUTION ? 'text-primary font-bold' : ''}>Contribution</span>
                  <ChevronRight size={14} />
                  <span className={user.step === AppStep.INVESTMENTS ? 'text-primary font-bold' : ''}>Investments</span>
                  <ChevronRight size={14} />
                  <span className={user.step === AppStep.REVIEW ? 'text-primary font-bold' : ''}>Review</span>
               </div>
            )}

            <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer transition">
                  <User size={18} className="text-gray-600"/>
               </div>
            </div>
          </div>
        </header>
      )}

      {/* MAIN CONTENT */}
      <main className="animate-in fade-in duration-500">
        {renderStep()}
      </main>

      {/* FOOTER (Simple) */}
      {!isAuthFlow && (
        <footer className="border-t border-gray-200 bg-white mt-12 py-8">
           <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
             &copy; 2024 RetireReady Inc. All rights reserved. Investment advisory services provided by RetireReady Advisors LLC.
           </div>
        </footer>
      )}

      {/* AI WIDGET */}
      {user.isLoggedIn && user.step !== AppStep.ONBOARDING && <FloatingAIAssistant />}
    </div>
  );
};

export default App;