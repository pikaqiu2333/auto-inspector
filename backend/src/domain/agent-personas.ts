export interface AgentPersona {
  name: string;
  type: 'newbie' | 'cautious' | 'impatient' | 'malicious';
  typingSpeed: number; // ms per character
  readsPrivacy: boolean;
  fillsOptional: boolean;
  isMalicious: boolean;
  description: string;
}

export const AGENT_PERSONAS: AgentPersona[] = [
  {
    name: 'Alice',
    type: 'newbie',
    typingSpeed: 150,
    readsPrivacy: false,
    fillsOptional: false,
    isMalicious: false,
    description: 'New user who types slowly and reads every prompt carefully'
  },
  {
    name: 'Bob',
    type: 'cautious',
    typingSpeed: 80,
    readsPrivacy: true,
    fillsOptional: true,
    isMalicious: false,
    description: 'Cautious user who checks privacy policy and fills optional fields'
  },
  {
    name: 'Charlie',
    type: 'impatient',
    typingSpeed: 50,
    readsPrivacy: false,
    fillsOptional: false,
    isMalicious: false,
    description: 'Impatient user who types fast and skips optional fields'
  },
  {
    name: 'David',
    type: 'malicious',
    typingSpeed: 80,
    readsPrivacy: false,
    fillsOptional: false,
    isMalicious: true,
    description: 'Malicious user who tries SQL injection and XSS attacks'
  }
];

export interface UXMetrics {
  successRate: number;
  averageDuration: number;
  confusionPoints: string[];
  errorCount: number;
}

export interface TestResult {
  persona: AgentPersona;
  success: boolean;
  duration: number;
  metrics: UXMetrics;
  screenshot?: string;
}
