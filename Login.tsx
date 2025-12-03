import React from 'react';
import { ArrowRight, Lock, Mail, TrendingUp, ShieldCheck, PieChart } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';

interface LoginProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword }) => {
  return (
    <div className="min-h-screen w-full flex bg-neutral">
      {/* Left: Hero Visual */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 to-primary relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Abstract glowing blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500 rounded-full blur-[120px] opacity-20"></div>

        <div className="z-10 max-w-lg space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <TrendingUp size={32} className="text-teal-400" />
            </div>
            <h1 className="text-4xl font-display font-bold">RetireReady</h1>
          </div>
          <h2 className="text-5xl font-display font-bold leading-tight">
            Secure your future with confidence.
          </h2>
          <p className="text-lg text-blue-100 font-light">
            AI-driven insights, personalized projections, and a curated selection of top-tier investment funds to help you reach financial freedom.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-8">
             <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <ShieldCheck className="text-teal-400" />
                <span className="font-semibold">Bank-grade Security</span>
             </div>
             <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <PieChart className="text-teal-400" />
                <span className="font-semibold">Smart Allocation</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-0 right-0 p-8">
            <span className="text-gray-500 text-sm">Not a member? <a href="#" className="text-primary font-semibold hover:underline">Contact HR</a></span>
        </div>
        
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h3 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome back</h3>
            <p className="text-gray-500">Sign in to manage your retirement portfolio.</p>
          </div>

          <Card className="space-y-6 !p-8 shadow-2xl border-none">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button onClick={onForgotPassword} className="text-primary hover:underline font-medium">Forgot password?</button>
            </div>

            <Button onClick={onLogin} className="w-full justify-center group">
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700">
                  Google
               </button>
               <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700">
                  Microsoft
               </button>
            </div>
          </Card>
          
          <p className="text-center text-xs text-gray-400">
            Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};