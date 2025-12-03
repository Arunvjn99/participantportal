import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Shield, TrendingUp, Zap, Sparkles, CheckCircle, DollarSign, Target } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';
import { UserProfile } from '../types';

interface OnboardingWizardProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
}

const STEPS = [
  'Basic Info',
  'Income',
  'Savings',
  'Contribution',
  'Risk',
  'Goal'
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ initialProfile, onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(prev => prev - 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleSave = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onComplete(profile);
    }, 2000); // Simulate AI generation delay
  };

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  // --- Step Components ---

  const StepBasicInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-2xl font-display font-bold text-gray-900">Let’s personalize your plan</h3>
        <p className="text-gray-500">We need a few details to build your projection.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-display font-bold text-gray-700 mb-2">Current Age</label>
          <div className="flex items-center gap-4">
             <input 
                type="range" min="18" max="80" 
                value={profile.currentAge}
                onChange={(e) => updateProfile('currentAge', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
             />
             <div className="w-20 px-4 py-2 border border-gray-200 rounded-lg text-center font-bold text-lg bg-white">
                {profile.currentAge}
             </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-display font-bold text-gray-700 mb-2">Target Retirement Age</label>
          <div className="flex items-center gap-4">
             <input 
                type="range" min={profile.currentAge + 1} max="85" 
                value={profile.retirementAge}
                onChange={(e) => updateProfile('retirementAge', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
             />
             <div className="w-20 px-4 py-2 border border-gray-200 rounded-lg text-center font-bold text-lg bg-white">
                {profile.retirementAge}
             </div>
          </div>
        </div>
      </div>
      
      {profile.retirementAge <= profile.currentAge && (
         <p className="text-sm text-red-500 bg-red-50 p-2 rounded">Retirement age must be greater than current age.</p>
      )}
    </div>
  );

  const StepIncome = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-2xl font-display font-bold text-gray-900">Income Details</h3>
        <p className="text-gray-500">These help us calculate future contributions and projected balances.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-display font-bold text-gray-700 mb-2">Current Annual Salary</label>
          <div className="relative">
             <DollarSign className="absolute left-4 top-3.5 text-gray-400" size={20}/>
             <input 
               type="number"
               value={profile.annualSalary}
               onChange={(e) => updateProfile('annualSalary', Number(e.target.value))}
               className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-sans text-lg font-semibold"
             />
          </div>
        </div>

        <div>
          <label className="block text-sm font-display font-bold text-gray-700 mb-2">Expected Annual Growth</label>
          <div className="grid grid-cols-4 gap-2">
             {[0, 3, 5, 8].map(rate => (
               <button 
                 key={rate}
                 onClick={() => updateProfile('salaryGrowth', rate)}
                 className={`py-3 rounded-lg border text-sm font-bold transition-all ${
                   profile.salaryGrowth === rate 
                     ? 'bg-blue-50 border-primary text-primary shadow-sm' 
                     : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                 }`}
               >
                 {rate}%
                 {rate === 3 && <span className="block text-[10px] font-normal text-gray-400">Avg</span>}
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const StepSavings = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-2xl font-display font-bold text-gray-900">Existing Savings</h3>
        <p className="text-gray-500">This allows your projection and readiness score to be accurate.</p>
      </div>

      <div>
        <label className="block text-sm font-display font-bold text-gray-700 mb-2">Current Retirement Savings</label>
        <div className="relative">
            <DollarSign className="absolute left-4 top-3.5 text-gray-400" size={20}/>
            <input 
            type="number"
            value={profile.existingSavings}
            onChange={(e) => updateProfile('existingSavings', Number(e.target.value))}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-sans text-lg font-semibold"
            />
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
         <div className="p-1.5 bg-blue-100 text-primary rounded-full mt-0.5"><Target size={16}/></div>
         <div>
            <h4 className="font-bold text-blue-900 text-sm">Why ask this?</h4>
            <p className="text-blue-700 text-xs mt-1">
                Knowing your starting point helps our AI determine if you're on track to replace 80% of your income.
            </p>
         </div>
      </div>
    </div>
  );

  const StepContribution = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-2xl font-display font-bold text-gray-900">Current Contribution</h3>
        <p className="text-gray-500">Your starting point for monthly savings.</p>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
         <div>
            <label className="flex justify-between text-sm font-display font-bold text-gray-700 mb-2">
                <span>My Contribution</span>
                <span className="text-primary">{15}%</span>
            </label>
            <input 
                type="range" min="0" max="25"
                defaultValue={15}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
             />
         </div>
         <div className="pt-4 border-t border-gray-100">
             <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-display font-bold text-gray-700">Employer Match</label>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
             </div>
             <div className="flex gap-4">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                    <div className="text-xs text-gray-500 uppercase">Match Rate</div>
                    <div className="font-bold text-gray-900">100%</div>
                </div>
                 <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                    <div className="text-xs text-gray-500 uppercase">Up To</div>
                    <div className="font-bold text-gray-900">6%</div>
                </div>
             </div>
             <p className="text-xs text-gray-500 mt-2 italic">
                Your employer match is free money toward your retirement.
             </p>
         </div>
      </div>
    </div>
  );

  const StepRisk = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-2xl font-display font-bold text-gray-900">Risk Appetite</h3>
        <p className="text-gray-500">How do you handle market fluctuations?</p>
      </div>

      <div className="space-y-3">
        {[
            { id: 'Conservative', icon: Shield, desc: 'Preserve capital, lower returns.', color: 'text-blue-600 bg-blue-50' },
            { id: 'Moderate', icon: TrendingUp, desc: 'Balance between growth and stability.', color: 'text-teal-600 bg-teal-50' },
            { id: 'Aggressive', icon: Zap, desc: 'Maximize growth, higher volatility.', color: 'text-orange-600 bg-orange-50' },
            { id: 'AI', icon: Sparkles, desc: 'Let AI decide based on your age.', color: 'text-purple-600 bg-purple-50' }
        ].map((option: any) => (
            <div 
                key={option.id}
                onClick={() => updateProfile('riskTolerance', option.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    profile.riskTolerance === option.id 
                    ? 'border-primary bg-blue-50/50 ring-1 ring-primary shadow-sm' 
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                }`}
            >
                <div className={`p-3 rounded-lg ${option.color}`}>
                    <option.icon size={24} />
                </div>
                <div>
                    <h4 className="font-display font-bold text-gray-900">{option.id === 'AI' ? 'Let AI Decide (Recommended)' : option.id}</h4>
                    <p className="text-sm text-gray-500">{option.desc}</p>
                </div>
                {profile.riskTolerance === option.id && (
                    <div className="ml-auto text-primary"><CheckCircle size={24} /></div>
                )}
            </div>
        ))}
      </div>
    </div>
  );

  const StepGoal = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-2xl font-display font-bold text-gray-900">Retirement Goal</h3>
        <p className="text-gray-500">What is your desired monthly income in retirement?</p>
      </div>

      <div className={`space-y-6 transition-opacity duration-300 ${profile.isIncomeGoalAutomated ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
         <div>
            <label className="block text-sm font-display font-bold text-gray-700 mb-2">Monthly Income Goal</label>
            <div className="relative">
                <DollarSign className="absolute left-4 top-3.5 text-gray-400" size={20}/>
                <input 
                    type="number"
                    value={profile.desiredRetirementIncome}
                    onChange={(e) => updateProfile('desiredRetirementIncome', Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-sans text-lg font-semibold"
                />
            </div>
         </div>
      </div>

      <div 
        onClick={() => updateProfile('isIncomeGoalAutomated', !profile.isIncomeGoalAutomated)}
        className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${
            profile.isIncomeGoalAutomated 
            ? 'border-teal-500 bg-teal-50' 
            : 'border-gray-200 hover:bg-gray-50'
        }`}
      >
         <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${profile.isIncomeGoalAutomated ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-gray-300'}`}>
            {profile.isIncomeGoalAutomated && <CheckCircle size={16}/>}
         </div>
         <div>
            <h4 className="font-bold text-gray-900">I'm not sure — let AI estimate this</h4>
            <p className="text-sm text-gray-500">We'll calculate this based on 80% of your final salary.</p>
         </div>
      </div>
    </div>
  );

  const Summary = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
       <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
             <Sparkles className="text-white w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-3xl font-display font-bold text-gray-900">Ready to build your plan</h3>
          <p className="text-gray-500">Review your details before we generate your strategy.</p>
       </div>

       <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-2 gap-y-6 gap-x-4">
          <div>
             <div className="text-xs text-gray-500 uppercase tracking-wide">Age / Retire At</div>
             <div className="font-bold text-gray-900">{profile.currentAge} / {profile.retirementAge}</div>
          </div>
          <div>
             <div className="text-xs text-gray-500 uppercase tracking-wide">Salary</div>
             <div className="font-bold text-gray-900">${profile.annualSalary.toLocaleString()}</div>
          </div>
           <div>
             <div className="text-xs text-gray-500 uppercase tracking-wide">Current Savings</div>
             <div className="font-bold text-gray-900">${profile.existingSavings.toLocaleString()}</div>
          </div>
          <div>
             <div className="text-xs text-gray-500 uppercase tracking-wide">Risk Profile</div>
             <div className="font-bold text-primary">{profile.riskTolerance}</div>
          </div>
       </div>

       <div className="flex gap-4 pt-4">
          <Button variant="ghost" onClick={handleBack} className="flex-1">Back</Button>
          <Button onClick={handleSave} className="flex-[2] justify-center shadow-glow">
             Save & Generate My Plan
          </Button>
       </div>
    </div>
  );

  // --- Main Render ---

  if (isGenerating) {
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
             <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-primary rounded-full animate-spin mx-auto"></div>
                <h3 className="text-xl font-bold text-gray-900">Generating AI Insights...</h3>
                <p className="text-gray-500">Analyzing thousands of market scenarios for you.</p>
             </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* 1. Full-Viewport Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B5FFF] via-[#00B37E] to-[#D5F3FF]"></div>
      
      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Abstract Shapes in Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-400 rounded-full blur-[120px] opacity-20"></div>
      
      {/* 2. Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* 3. Modal Wrapper with Gradient Border & Glow */}
      <div className="relative w-full max-w-2xl rounded-2xl p-[2px] bg-gradient-to-br from-[#0B5FFF] to-[#00B37E] shadow-[0_20px_60px_rgba(11,95,255,0.25)] z-10">
        <div className="w-full h-full bg-white/95 backdrop-blur-xl rounded-2xl relative overflow-hidden flex flex-col min-h-[600px]">
          
            {/* 4. Top Accent Illustration inside Modal */}
            <div className="absolute top-0 right-0 w-full h-64 pointer-events-none opacity-[0.08] z-0 overflow-hidden">
                <svg viewBox="0 0 400 200" className="w-full h-full text-teal-600 fill-current">
                   <path d="M0,100 C150,200 250,0 400,100" stroke="currentColor" strokeWidth="2" fill="none" />
                   <circle cx="50" cy="50" r="20" fill="currentColor" />
                   <circle cx="350" cy="150" r="40" fill="currentColor" />
                   <rect x="150" y="50" width="100" height="100" stroke="currentColor" strokeWidth="1" fill="none" />
                   {/* Grid dots */}
                   <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="currentColor" />
                   </pattern>
                   <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />
                </svg>
            </div>

            {/* Original Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 z-20">
               <div 
                 className="h-full bg-gradient-to-r from-primary to-teal-400 transition-all duration-500 ease-out"
                 style={{ width: `${(step / (STEPS.length + 1)) * 100}%` }}
               />
            </div>

            {/* Header */}
            {step <= STEPS.length && (
                <div className="flex justify-between items-center mb-4 px-8 pt-8 relative z-10">
                    <span className="text-sm font-bold text-primary tracking-widest uppercase">Step {step} of {STEPS.length}</span>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">Save & Exit</button>
                </div>
            )}

            {/* Content Area */}
            <div className={`flex-1 flex flex-col justify-center px-8 relative z-10 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
               {step === 1 && <StepBasicInfo />}
               {step === 2 && <StepIncome />}
               {step === 3 && <StepSavings />}
               {step === 4 && <StepContribution />}
               {step === 5 && <StepRisk />}
               {step === 6 && <StepGoal />}
               {step === 7 && <Summary />}
            </div>

            {/* Footer Navigation */}
            {step <= STEPS.length && (
                <div className="flex justify-between items-center mt-auto px-8 pb-8 pt-6 border-t border-gray-100 relative z-10 bg-white/50 backdrop-blur-sm">
                    <Button 
                        variant="ghost" 
                        onClick={handleBack} 
                        disabled={step === 1}
                        className={step === 1 ? 'opacity-0 pointer-events-none' : ''}
                    >
                        <ChevronLeft size={18} /> Back
                    </Button>
                    <Button onClick={handleNext} className="shadow-lg shadow-blue-500/20">
                        Next Step <ChevronRight size={18} />
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
