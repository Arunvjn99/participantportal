import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, ShieldCheck, Lock, Eye, EyeOff, CheckCircle, RefreshCcw } from 'lucide-react';
import { Button, Card, ProgressBar } from '../components/UIComponents';

// --- Shared Layout Wrapper ---
const AuthLayout: React.FC<{
  children: React.ReactNode;
  illustration: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ children, illustration, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex bg-neutral">
      {/* Left: Hero Visual */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 to-primary relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Abstract glowing blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500 rounded-full blur-[120px] opacity-20"></div>

        <div className="z-10 max-w-lg space-y-6 text-center">
            <div className="flex justify-center mb-6">
                {illustration}
            </div>
            <h2 className="text-4xl font-display font-bold leading-tight">{title}</h2>
            <p className="text-lg text-blue-100 font-light">{subtitle}</p>
        </div>
      </div>

      {/* Right: Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
            {children}
        </div>
      </div>
    </div>
  );
};

// --- SCREEN 1: Forgot Password Email ---
export const ForgotPasswordEmail: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        onNext();
    };

    return (
        <AuthLayout 
            title="Account Recovery"
            subtitle="We use bank-grade security to ensure your account remains safe during the recovery process."
            illustration={
                <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-glow border border-white/20">
                    <Mail size={48} className="text-teal-400" />
                </div>
            }
        >
            <div className="mb-8">
                 <h3 className="text-3xl font-display font-bold text-gray-900 mb-2">Forgot your password?</h3>
                 <p className="text-gray-500">Enter the email associated with your account, and we’ll send you reset instructions.</p>
            </div>

            <Card className="space-y-6 !p-8 shadow-2xl border-none">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="name@company.com" 
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-primary focus:border-transparent'}`}
                        />
                    </div>
                    {error ? (
                        <p className="text-xs text-red-500 mt-2">{error}</p>
                    ) : (
                        <p className="text-xs text-gray-400 mt-2">We’ll never share your email.</p>
                    )}
                </div>

                <Button onClick={handleSubmit} className="w-full justify-center">Send Reset Link</Button>

                <div className="text-center">
                    <button onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto">
                        <ArrowLeft size={16} /> Back to Sign In
                    </button>
                </div>
            </Card>
        </AuthLayout>
    );
};

// --- SCREEN 2: Verification Code (OTP) ---
export const ForgotPasswordOTP: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [error, setError] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        setError('');

        if (element.value && element.nextSibling) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleVerify = () => {
        if (otp.join('').length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }
        onNext();
    };

    return (
        <AuthLayout 
            title="Verify Identity"
            subtitle="Two-factor authentication ensures only you can access your retirement portfolio."
            illustration={
                <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-glow border border-white/20">
                    <ShieldCheck size={48} className="text-teal-400" />
                </div>
            }
        >
            <div className="mb-8">
                 <h3 className="text-3xl font-display font-bold text-gray-900 mb-2">Check your email</h3>
                 <p className="text-gray-500">We’ve sent a 6-digit verification code to your email.</p>
            </div>

            <Card className="space-y-8 !p-8 shadow-2xl border-none">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 text-center">Enter Verification Code</label>
                    <div className="flex justify-between gap-2">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                className={`w-12 h-14 border rounded-lg text-center text-xl font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                        const inputs = e.currentTarget.parentElement?.querySelectorAll('input');
                                        inputs?.[index - 1]?.focus();
                                    }
                                    if(e.key === 'Enter') handleVerify();
                                }}
                            />
                        ))}
                    </div>
                    {error && <p className="text-center text-xs text-red-500 animate-pulse">{error}</p>}
                </div>

                <div className="text-center text-sm">
                    {timer > 0 ? (
                        <p className="text-gray-400">Resend code in <span className="font-mono text-gray-600">00:{timer.toString().padStart(2, '0')}</span></p>
                    ) : (
                        <button onClick={() => setTimer(30)} className="text-primary font-bold hover:underline">Resend now</button>
                    )}
                </div>

                <Button onClick={handleVerify} className="w-full justify-center">Verify Code</Button>

                <div className="flex justify-center items-center gap-2 text-xs text-teal-600 bg-teal-50 py-2 rounded-lg">
                    <ShieldCheck size={14} />
                    Secure Account Recovery
                </div>
            </Card>
            
             <div className="text-center mt-6">
                <button onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto">
                    <ArrowLeft size={16} /> Use a different email
                </button>
            </div>
        </AuthLayout>
    );
};

// --- SCREEN 3: Reset Password ---
export const ForgotPasswordReset: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
    const [pass, setPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        let score = 0;
        if (pass.length > 7) score += 25;
        if (/[A-Z]/.test(pass)) score += 25;
        if (/[0-9]/.test(pass)) score += 25;
        if (/[^A-Za-z0-9]/.test(pass)) score += 25;
        setStrength(score);
    }, [pass]);

    const handleReset = () => {
        if (strength < 75 || pass !== confirm) return;
        onNext();
    };

    return (
        <AuthLayout 
            title="Create New Password"
            subtitle="Choose a strong password to protect your financial future."
            illustration={
                <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-glow border border-white/20">
                    <Lock size={48} className="text-teal-400" />
                </div>
            }
        >
             <div className="mb-8">
                 <h3 className="text-3xl font-display font-bold text-gray-900 mb-2">Create new password</h3>
                 <p className="text-gray-500">Use at least 8 characters, including uppercase, lowercase, and numbers.</p>
            </div>

            <Card className="space-y-6 !p-8 shadow-2xl border-none">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input 
                                type={showPass ? "text" : "password"}
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                         {/* Strength Meter */}
                        <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-300 ${strength < 50 ? 'bg-red-400' : strength < 100 ? 'bg-yellow-400' : 'bg-teal-500'}`} 
                                style={{width: `${strength}%`}}
                            />
                        </div>
                        <p className="text-xs text-right mt-1 text-gray-400">
                            {strength < 50 ? 'Weak' : strength < 100 ? 'Medium' : 'Strong'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input 
                                type={showPass ? "text" : "password"}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        {confirm && pass !== confirm && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
                    </div>
                </div>

                <Button 
                    onClick={handleReset} 
                    disabled={strength < 50 || pass !== confirm}
                    className="w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Reset Password
                </Button>
            </Card>

             <div className="text-center mt-6">
                <button onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto">
                    <ArrowLeft size={16} /> Cancel
                </button>
            </div>
        </AuthLayout>
    );
};

// --- SCREEN 4: Success ---
export const ForgotPasswordSuccess: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    return (
        <AuthLayout 
            title="All Set!"
            subtitle="Your account has been successfully updated."
            illustration={
                <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-glow border border-white/20">
                    <CheckCircle size={48} className="text-teal-400" />
                </div>
            }
        >
            <Card className="text-center !p-12 shadow-2xl border-none space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} className="text-green-600" />
                </div>
                
                <div>
                    <h3 className="text-3xl font-display font-bold text-gray-900 mb-2">Password Reset Successful</h3>
                    <p className="text-gray-500">Your account is secure. You can now sign in with your new password.</p>
                </div>

                <Button onClick={onComplete} className="w-full justify-center text-lg py-4">
                    Back to Sign In
                </Button>

                <div className="flex justify-center items-center gap-2 text-xs text-gray-400 mt-4">
                    <ShieldCheck size={12} />
                    Security powered by enterprise-grade protection.
                </div>
            </Card>
        </AuthLayout>
    );
};