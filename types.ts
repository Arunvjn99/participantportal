
export interface Plan {
  id: string;
  name: string;
  type: '401(k)' | 'Roth 401(k)' | '403(b)';
  match: string;
  description: string;
  recommended?: boolean;
  fitScore?: number;
  features: string[];
}

export interface InvestmentFund {
  id: string;
  name: string;
  ticker: string;
  family: string;
  assetClass: 'Equity' | 'Fixed Income' | 'Cash' | 'Alternatives' | 'Target Date';
  type: 'Equity' | 'Bond' | 'Target Date' | 'Cash'; // Deprecated in favor of assetClass, keeping for compatibility
  sourceType: 'Plan' | 'Brokerage' | 'External';
  expenseRatio: number;
  riskLevel: number; // 1-10
  allocation: number;
  returns: number[]; // For sparkline
  isRecommended?: boolean;
  aiInsight?: string;
}

export interface PortfolioStrategy {
  id: string;
  name: string;
  riskLabel: 'Conservative' | 'Balanced' | 'Growth';
  description: string;
  fitScore: number;
  expectedReturnRange: string;
  allocations: { fundId: string; percentage: number }[];
}

export interface Advisor {
  id: string;
  name: string;
  photoUrl: string;
  credentials: string[];
  specialties: string[];
  rating: number;
  isOnline: boolean;
  nextAvailableSlot: string;
  type: 'HUMAN' | 'AI';
}

export enum AdvisorType {
  AI = 'AI',
  HUMAN = 'HUMAN'
}

export interface Appointment {
  advisorId: string;
  date: Date;
  type: 'Video' | 'Phone' | 'In-Person';
  notes: string;
}

export interface UserProfile {
  currentAge: number;
  retirementAge: number;
  annualSalary: number;
  salaryGrowth: number;
  existingSavings: number;
  otherSavings: number;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive' | 'AI';
  desiredRetirementIncome: number;
  isIncomeGoalAutomated: boolean;
}

export interface UserState {
  isLoggedIn: boolean;
  name: string;
  profile: UserProfile;
  selectedPlanId: string | null;
  contributionRate: number; // Percentage
  autoIncrease: boolean;
  autoIncreaseStep?: number;
  autoIncreaseCap?: number;
  autoIncreaseStartYear?: number;
  investments: InvestmentFund[];
  step: AppStep;
}

export enum AppStep {
  LOGIN = 'LOGIN',
  FORGOT_PASSWORD_EMAIL = 'FORGOT_PASSWORD_EMAIL',
  FORGOT_PASSWORD_OTP = 'FORGOT_PASSWORD_OTP',
  FORGOT_PASSWORD_RESET = 'FORGOT_PASSWORD_RESET',
  FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS',
  DASHBOARD_PRE = 'DASHBOARD_PRE',
  ONBOARDING = 'ONBOARDING',
  PLAN_SELECTION = 'PLAN_SELECTION',
  CONTRIBUTION = 'CONTRIBUTION',
  INVESTMENTS = 'INVESTMENTS',
  REVIEW = 'REVIEW',
  DASHBOARD_POST = 'DASHBOARD_POST',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  actions?: { label: string; action: string; payload?: any }[];
}
