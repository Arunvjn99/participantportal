import React from 'react';
import { PlayCircle, FileText, HelpCircle, ArrowRight, Shield, TrendingUp, DollarSign } from 'lucide-react';
import { Button, Card, Badge } from '../components/UIComponents';

export const PreEnrollment: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-premium overflow-hidden border border-blue-50">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-6">
            <Badge color="teal">Enrollment Open</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 leading-tight">
              Hello, Satish. <br/>
              <span className="text-primary">Let's build your future.</span>
            </h1>
            <p className="text-lg text-gray-600">
              Your employer matches 100% of the first 6%. Start your journey to financial freedom today with a personalized plan.
            </p>
            <div className="flex gap-4 pt-2">
              <Button size="lg" onClick={onStart}>Compare Plans</Button>
              <Button variant="ghost" size="lg" icon={PlayCircle}>Watch 2-min Explainer</Button>
            </div>
          </div>
          {/* Illustration placeholder */}
          <div className="w-full md:w-1/3 aspect-square relative animate-float hidden md:block">
            <img src="https://picsum.photos/400/400?random=1" className="rounded-2xl shadow-2xl object-cover mask-image-gradient" alt="Retirement" />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce delay-700">
               <div className="p-2 bg-green-100 rounded-lg text-green-600"><TrendingUp size={24}/></div>
               <div>
                 <div className="text-xs text-gray-500">Projected Growth</div>
                 <div className="font-bold text-gray-800">+12% YoY</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: DollarSign, title: "Employer Match", desc: "Get free money. We match 100% up to 6% of your salary.", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Shield, title: "Tax Advantages", desc: "Lower your taxable income now or enjoy tax-free withdrawals later.", color: "text-teal-600", bg: "bg-teal-50" },
          { icon: TrendingUp, title: "Compound Growth", desc: "Start early. Even small contributions grow significantly over time.", color: "text-purple-600", bg: "bg-purple-50" }
        ].map((item, i) => (
          <Card key={i} className="group hover:border-primary/30 transition-colors">
            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>

      {/* Learning Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-display font-bold">Recommended Learning</h2>
            <p className="text-gray-500">Short guides to help you decide.</p>
          </div>
          <Button variant="ghost" className="text-sm">View all</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card hoverEffect className="col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="relative z-10 h-full flex flex-col justify-between min-h-[160px]">
               <Badge color="orange">Video • 3 min</Badge>
               <div>
                 <h3 className="text-xl font-bold mb-2">Roth vs. Traditional 401(k)</h3>
                 <p className="text-gray-300 text-sm">Understand the tax implications before you choose.</p>
               </div>
               <PlayCircle className="absolute bottom-6 right-6 text-white/20 w-16 h-16" />
             </div>
          </Card>
          
          <Card hoverEffect className="cursor-pointer">
             <FileText className="text-primary mb-4" size={32} />
             <h3 className="font-bold mb-1">Plan Summary PDF</h3>
             <p className="text-sm text-gray-500">Official document detailing fees and funds.</p>
          </Card>
           <Card hoverEffect className="cursor-pointer">
             <HelpCircle className="text-accent mb-4" size={32} />
             <h3 className="font-bold mb-1">Risk Quiz</h3>
             <p className="text-sm text-gray-500">Find your investor personality in 60 seconds.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
